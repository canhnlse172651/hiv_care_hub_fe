import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import { Card, Typography, Spin, Alert, Empty, Pagination } from 'antd';

const { Title, Paragraph } = Typography;

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9, // 3 cards per row, so 3 rows
    total: 0,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: pagination.current,
          limit: pagination.pageSize,
        };
        const response = await blogService.getAllBlogs(params);
        if (response.statusCode === 200) {
          setBlogs(response.data.data);
          setPagination(prev => ({
            ...prev,
            total: response.data.meta.total,
          }));
        } else {
          setError(response.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        setError('An error occurred while fetching blogs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pagination.current, pagination.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };
  
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Title level={2} className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Kiến thức
          </Title>
          <Paragraph className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Cập nhật những thông tin, kiến thức mới nhất về sức khỏe.
          </Paragraph>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : blogs.length === 0 ? (
          <Empty description="Không có bài viết nào." />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {blogs.map((blog) => (
                <Link to={`/blogs/${blog.slug}`} key={blog.id}>
                  <Card
                    hoverable
                    className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col"
                    cover={
                      <img
                        alt={blog.title}
                        src={blog.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}
                        className="h-56 w-full object-cover"
                      />
                    }
                  >
                    <div className="p-6 flex-grow flex flex-col">
                      <Title level={4} className="flex-grow">{blog.title}</Title>
                      <Paragraph className="text-gray-600 mt-2">
                        {truncateText(blog.content, 100)}
                      </Paragraph>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>By {blog.author.name}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 