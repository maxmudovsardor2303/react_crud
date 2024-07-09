import React from "react";
import { Pagination } from "@mui/material";

const GlobalPagination = ({ totalCount, page, limit, setPage }) => {
  const totalPages = Math.ceil(totalCount / limit);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Pagination
      count={totalPages}
      page={page}
      onChange={handleChange}
      color="primary"
      shape="rounded"
    />
  );
};

export default GlobalPagination;
