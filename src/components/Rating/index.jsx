import { Rating } from "@mui/material";

const RatingComp = ({ rating }) => {
  const adjustedRating = Math.round(rating * 10) / 10; // Làm tròn rating về 1 chữ số thập phân
  return <Rating name="half-rating-read" value={adjustedRating} precision={0.5} readOnly />;
};

export default RatingComp;


