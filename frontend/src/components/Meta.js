import React from 'react';
import { Helmet } from 'react-helmet';

function Meta({ title, description, keyword }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta name="keyword" content={keyword}></meta>
    </Helmet>
  );
}

Meta.defaultProps = {
  title: 'Welcome to Proshop',
  description: 'We Sell the best product for cheap',
  keyword: 'electronics, buy electronics ,cheap electronics',
};

export default Meta;
