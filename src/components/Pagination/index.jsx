import { useMemo } from "react";
// import { style } from "styled-components";

const PAGE_STEP = 2;
let begin;
let end;

const Pagination = ({ onPagiChange, currentPage, limit, total }) => {
  const totalPage = useMemo(() => {
    if (!limit || !total) {
      return 1;
    }
    return Math.ceil(Number(total) / Number(limit)) || 1;
  }, [limit, total]);

  const pageList = useMemo(() => {
    begin = currentPage - PAGE_STEP;
     end = currentPage + PAGE_STEP;

    if (begin <= 0) {
      begin = 1;
      end = begin + PAGE_STEP * 2;
      if (end > totalPage) {
        end = totalPage;
      }
    }
    if (end >= totalPage) {
      end = totalPage;
      begin = end - PAGE_STEP * 2;
      if (begin < 1) {
        begin = 1;
      }
    }

    const list = [];

    for (let i = begin; i < end + 1; i++) {
      list.push(i);
    }
    return list;
  }, [currentPage, totalPage]);

  const onNext = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPage) {
      onPagiChange(nextPage);
    }
  };

  const onPrev = () => {
    const prePage = currentPage - 1;
    if (prePage > 0) {
      onPagiChange(prePage);
    }
  };
  const onFirst = () => {
    onPagiChange(1);
  };
  const onLast = () => {
    onPagiChange(totalPage);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className = {`page-item ${currentPage === 1 ? "disabled" :""}`} style={{cursor:"pointer"}} >
          <a
            className="page-link page-link-prev"
           
            aria-label="Previous"
            tabIndex={-1}
            aria-disabled="true"
            onClick={onPrev}
          >
            <span aria-hidden="true">
              <i className="icon-long-arrow-left" />
            </span>
            Prev{" "}
          </a>
        </li>
        {pageList?.map((index) => {
          return (
            <li  style={{cursor:"pointer"}} className= {`page-item ${index === currentPage ? "active" : ""}`}  key={index} onClick={() => onPagiChange(index)} >
              <a className="page-link" >
                {index}
              </a>
            </li>
          );
        })}
        <li className="page-item-total">of {totalPage}</li>
        <li className={`page-item ${currentPage === totalPage ? "disabled" :""}`} style={{cursor:"pointer"}}>
          <a className="page-link page-link-next"  aria-label="Next"  onClick={onNext}>
            {" "}
            Next{" "}
            <span aria-hidden="true">
              <i className="icon-long-arrow-right" />
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
