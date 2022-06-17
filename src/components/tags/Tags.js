import React from 'react'
import Tag from './Tag';

const Tags = ({ tags }) => {
    console.log("List of tags: ", tags);
    return (
        <div className="project-list section">
            {tags && tags.map(tag => {
                return (
                    <Tag tag={tag} />
                )
            })}
        </div>
    );
}

export default Tags;