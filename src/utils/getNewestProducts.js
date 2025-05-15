

export const getNewestProducts = (products, limit = 10) => {
    // Sắp xếp danh sách sản phẩm theo trường createdAt giảm dần
    const sortedProducts = products?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Trả về tối đa 'limit' sản phẩm mới nhất
    return sortedProducts?.slice(0, limit);
  };