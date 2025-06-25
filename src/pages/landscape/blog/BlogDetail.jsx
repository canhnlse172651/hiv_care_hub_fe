import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import { Spin, Alert, Typography, Avatar, Tag, Breadcrumb } from 'antd';
import { UserOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogService.getBlogBySlug(slug);
        if (response.statusCode === 200) {
          setBlog(response.data);
        } else {
          setError(response.message || 'Failed to fetch blog post');
        }
      } catch (err) {
        setError('The requested blog post could not be found or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert message="Error" description={error} type="error" showIcon />
        <div className="mt-4 text-center">
            <Link to="/blogs" className="text-blue-500 hover:underline">
                Go back to Blogs
            </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <Alert message="Not Found" description="This blog post does not exist." type="warning" showIcon />
            <div className="mt-4">
                <Link to="/blogs" className="text-blue-500 hover:underline">
                    Go back to Blogs
                </Link>
            </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
            <Breadcrumb className="mb-8">
                <Breadcrumb.Item>
                    <Link to="/"><HomeOutlined /></Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/blogs">Kiến thức</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
            </Breadcrumb>

            <article>
                <header className="mb-8">
                    {blog.category && (
                        <Tag color="blue" className="mb-4">{blog.category.title}</Tag>
                    )}
                    <Title level={1} className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {blog.title}
                    </Title>
                    <div className="mt-4 flex items-center text-gray-500">
                        <div className="flex items-center mr-6">
                            <Avatar src={blog.author?.avatar} icon={<UserOutlined />} size="small" className="mr-2" />
                            <Text>{blog.author?.name || 'Anonymous'}</Text>
                        </div>
                        <div className="flex items-center">
                            <CalendarOutlined className="mr-2" />
                            <Text>{dayjs(blog.createdAt).format('MMMM D, YYYY')}</Text>
                        </div>
                    </div>
                </header>

                {blog.imageUrl && (
                    <div className="mb-8">
                        <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-full h-auto rounded-lg shadow-md object-cover"
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                )}
                
                <div 
                    className="prose lg:prose-xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
            </article>
        </div>
    </div>
  );
};

export default BlogDetailPage; 