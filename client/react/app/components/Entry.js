import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import './Entry.less';

// Temporary fix for line breaks
const formatContent = (content = '') =>
  content
    .split('\n')
    .map((text, i) => (
      <div key={i}>{text}<br /></div>
    ));

const Entry = ({ entry }) => {
  const { title, content, created_at } = entry;

  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {title}
      </h2>

      <div className="entry-content">
        {content ? formatContent(content) : ''}
      </div>

      <small>{created_at}</small>
      <div>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
};

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default Entry;
