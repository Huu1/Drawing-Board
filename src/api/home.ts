import request from '@/utils/http';

export const getArticle = (data: any) => {
  return request.get('/api/article/queryAllPublish', data);
};
