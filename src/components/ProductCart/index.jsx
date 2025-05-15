import React from "react";
import { formatCurrencyUs } from "@/utils/formatCurrency";
import { Link } from "react-router-dom";
import RatingComp from "@/components/Rating";
import { PATHS } from "@/constant/path";
import { handleAddCart } from "@/store/Reducer/cartReducer";
import { useDispatch } from "react-redux";
import { localToken } from "@/utils/token";
import { handleShowModal } from "@/store/Reducer/authReducer";
import { MODAL_TYPE } from "@/constant/general";

const ProductCart = ({
  name,
  price,
  rating,
  slug,
  id,
  images,
  detailPath,
  homeStyle,
  discount,
  color,
  deal,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!localToken.get()) {
      dispatch(handleShowModal(MODAL_TYPE.login));
      return;
    }
    //ADD CART
    const addCartPayload = {
      addId: id,
      addColor: color?.[0],
      addQuantity: 1,
      addPrice: price - discount,
    };
    try {
      const res = await dispatch(handleAddCart(addCartPayload)).unwrap();
    } catch (error) {
      console.log("error", error);
      message.error("Add To Cart Fail");
    }
  };

  const productStyle = homeStyle
    ? { height: "400px", width: "95%" }
    : { height: "auto", width: "100%" };

  return (
    <div className="product product-2" style={productStyle}>
      <figure className="product-media">
        <Link to={detailPath}>
          <img src={images[0]} alt="Product image" className="product-image" />
        </Link>
        <div className="product-action product-action-dark">
          <a
            href="#"
            className="btn-product btn-cart"
            title="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <span>add to cart</span>
          </a>
        </div>
      </figure>
      <div className="product-body">
        <h3 className="product-title">
          <Link to={PATHS.PRODUCT_DETAIL}>{name}</Link>
        </h3>
        {!!!deal ? (
          <div className="product-price">{formatCurrencyUs(price)}</div>
        ) : (
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{ textDecoration: "line-through", color: "orange" }}
              className="product-price"
            >
              {formatCurrencyUs(price)}{" "}
            </div>
            <div className="product-price">
              {formatCurrencyUs(price - discount)}{" "}
            </div>
          </div>
        )}
        <div className="ratings-container">
          <RatingComp rating={rating} />
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
