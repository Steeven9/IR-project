/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable react/display-name */
import { TextField, Typography } from "@material-ui/core";
import Axios from "axios";
import MaterialTable from "material-table";
import React, { useState } from "react";
import useStyles from "./AppStyle";

function App() {  
	const classes = useStyles();
  
	const columns = [
		{
			title: "",
			field: "image",
			filtering: false,
			render: (rowData) => <img alt="Movie poster" src={rowData.img_url} style={{width: 50}}/>
		},
		{
			title: "Title",
			field: "title",
			filterPlaceholder: "Title",
			emptyValue: "Unknown"
		},
		{
			title: "Year",
			field: "year",
			filterPlaceholder: "Year",
			emptyValue: "Unknown"
		},
		{
			title: "Rating",
			field: "rating",
			filterPlaceholder: "Rating",
			emptyValue: "Unknown"
		},
		{
			title: "Genre",
			field: "genre",
			filterPlaceholder: "Genre",
			emptyValue: "Unknown",
			render: (rowData) => <Typography>{rowData.genre.join(", ")}</Typography>
		},
		{
			title: "Description",
			field: "description",
			filterPlaceholder: "Description",
			emptyValue: "Unknown"
		}
	];

	const options = {
		doubleHorizontalScroll: true,
		filtering: true,
		toolbar: false,
		emptyRowsWhenPaging: false,
		pageSize: 10
	};
	
	let [tableData, setTableData] = useState([]);
	let [isLoading, setIsLoading] = useState(false);
  
	const searchMovies = (keyword) => {
		setIsLoading(true);
		if (keyword) {
		// &rows=2147483647 is a hack to retrieve more than 10 docs at a time
			Axios.get("/solr/movies/select?q=*" + keyword + "*&rows=2147483647")
				.then((res) => {
					setTableData(res.data.response.docs);
					setIsLoading(false);
				})
				.catch((e) => {
					console.error(e);
					setIsLoading(false);
				});
		} else {
			setTableData([]);
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className={classes.dispFlex}>
				<marquee scrolldelay="100" behavior="slide" direction="down" style={{width:"auto"}}><img alt="Logo" src="logo192.png"/></marquee>
				<marquee scrolldelay="10" truespeed="true" behavior="slide"><Typography variant="h1" color="primary">IR project - movie search</Typography></marquee>
			</div>
      
			<form noValidate autoComplete="off" className={classes.margin20}>
				<TextField fullWidth label="Search by title, genre, year, ..." variant="outlined" onChange={(e) => searchMovies(e.target.value)}/>
			</form>

			<MaterialTable
				columns={columns}				
				isLoading={isLoading}
				options={options}
				data={tableData}
			/>
		</>
	);
}

export default App;
