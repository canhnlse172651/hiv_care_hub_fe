import { Empty } from "antd";
import { useEffect, useState } from "react";
function Accordion({ label = "", data = [], type = "question" }) {
 

  const [isActive, setIsActive] = useState("");

  const _onClick = (id) => {
    if (id === isActive) {
      setIsActive("");
    } else {
      setIsActive(id);
    }
  };

  console.log("isActive", isActive);

  return (
    <div className="accordion">
      {label && <h3 className="accordion__title label">{label}</h3>}

      {type === "question" ? (
        data?.length > 0 ? (
          data.map((item, index) => {
            const { id, question, answer } = item || {};
            return (
              <div
                className={`accordion__content ${
                  isActive === id ? "active" : ""
                }`}
                key={id || index + new Date()}
                onClick={() => _onClick(id)}
              >
                <div className="accordion__content-title">
                  <h4>
                    <strong>{question || ""}</strong>
                  </h4>
                </div>
                <div className="accordion__content-text">{answer || ""}</div>
              </div>
            );
          })
        ) : (
          <Empty description="No found anything" style={{ margin: "0 auto" }} />
        )
      ) : data?.length > 0 ? (
        data.map((item, index) => {
          const des = item.description;
          const title = item.title;
          return (
            <div
              key={index}
              className={`accordion__content ${ isActive === title ? "active" : "" }`}
              onClick={() => _onClick(title)}
            >
              <div className="accordion__content-title">
                <h4>
                  <strong>{title || ""}</strong>
                </h4>
              </div>
              <div className="accordion__content-text">
                {des?.map((item, _index) => {
                  return (
                    <div key={_index } className="item --lock">
                      <p>
                        <i>
                          <img
                            src="https://cfdcircle.vn/img/iconlock.svg"
                            alt="CFD Circle"
                          />
                        </i>
                        <span>{item}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <Empty description="No found anything" style={{ margin: "0 auto" }} />
      )}
    </div>
  );
}

export default Accordion;
