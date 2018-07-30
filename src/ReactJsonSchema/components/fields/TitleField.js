import React from "react";
import PropTypes from "prop-types";
import './style.scss'
const REQUIRED_FIELD_SYMBOL = "*";

function TitleField(props) {
  const { id, title, required, titleLevel } = props;
  // const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  let className = titleLevel? `title-field-level-${titleLevel}`: 'title-field-level-one' //title-field-default
  if(titleLevel && Number.isInteger(+titleLevel)){
    return <div className={className} style={{marginBottom: +titleLevel}} id={id}></div>;
  }
  return <div className={className} id={id}>{title}</div>;
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
