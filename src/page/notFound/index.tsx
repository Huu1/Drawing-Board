import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <span>
      返回首页 <Link to='/'>Home</Link>
    </span>
  );
};

export default Index;
