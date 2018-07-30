import React, { Component } from 'react';
import './style.scss';

const BasePageContainer = (children, schema) => {
	return (
		<div className="page_container_base">
			{ schema.title == null ? null : (<div className="pagetitle">{schema.title}</div>)}
			<div className="pagecontainer">
				{children}
			</div>
		</div>
	)
}

export const warpPageContainer = (children, schema) => {
	let newView = children;
	if (schema != null) {
		switch (schema.type) {
	      case "BaseContainer":
	        newView = new BasePageContainer(children, schema)
	        break;
	      default:
	        break;
	    } 
	}
	return newView;
}