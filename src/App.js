/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable react/display-name */
import { Button, Snackbar, TextField, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
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
			width: "auto",
			render: (rowData) => {
				return (
					<img 
						alt="Movie poster" 
						src={rowData.img_url ? rowData.img_url : "images/lazy.gif"} 
						style={{width: 50}}
					/>);
			}
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
		},
		{
			title: "Origin",
			field: "origin",
			filterPlaceholder: "Origin",
			emptyValue: "Unknown"
		}
	];

	const options = {
		filtering: true,
		emptyRowsWhenPaging: false,
		paging: false
	};
	
	// Table data and state
	let [tableData, setTableData] = useState([]);
	let [isLoading, setIsLoading] = useState(false);
	let [index, setIndex] = useState(0);
	let [totalResults, setTotalResults] = useState(0);
	let [keyword, setKeyword] = useState("");
	const NUM_PER_PAGE = 10;

	// Error snackbar at the bottom
	let [showAlert, setShowAlert] = useState(false);
	let [alertText, setAlertText] = useState("");
  
	const searchMovies = (i) => {
		setIsLoading(true);
		if (keyword.length === 0) {
			setTableData([]);
			setIsLoading(false);
		} else if (i >= 0) {
			Axios.get("/solr/movies/select?q=*" + keyword + "*&sort=title%20asc&start=" + (NUM_PER_PAGE * i))
				.then((res) => {
					setTableData(res.data.response.docs);
					setTotalResults(res.data.response.numFound);
					setIsLoading(false);
					setIndex(i);
				})
				.catch((e) => {
					console.error(e);
					setIsLoading(false);
					setAlertText(e.message);
					setShowAlert(true);
				});
		}
	};

	return (
		<div className={classes.margin20}>
			<div className={classes.dispFlex}>
				<marquee scrolldelay="100" behavior="slide" direction="down" style={{width:"auto"}}><img alt="Logo" src="logo192.png"/></marquee>
				<marquee scrolldelay="10" truespeed="true" behavior="slide"><Typography variant="h1" color="primary">IR project - movie search</Typography></marquee>
			</div>
      
			<form noValidate autoComplete="off" className={classes.marginVert20 + " " + classes.dispFlex} onSubmit={(evt) => {evt.preventDefault(); searchMovies(0);}}>
				<TextField 
					fullWidth 
					label="Search by title, genre, year, ..." 
					variant="outlined" 
					onChange={(e) => {setKeyword(e.target.value);}}
				/>
				<Button 
					variant="contained" 
					color="primary"
					className={classes.margin20}
					onClick={() => {searchMovies(index);}}
				>
					Search <Search />
				</Button>
			</form>

			<MaterialTable
				columns={columns}				
				isLoading={isLoading}
				options={options}
				data={tableData}
				components={{
					Toolbar: () => (
						<div className={classes.spacedButtons}>
							<Button 
								variant="contained" 
								color="primary"
								disabled={index === 0}
								className={classes.margin20}
								onClick={() => {searchMovies(index - 1);}}
							>
								Prev
							</Button>
							<Typography className={classes.margin20}>
								{totalResults === 0 ? "" : (<>Page {index + 1} of {Math.ceil(totalResults / NUM_PER_PAGE)}</>)}
							</Typography>
							<Button 
								variant="contained" 
								color="primary"
								className={classes.margin20}
								onClick={() => {searchMovies(index + 1);}}
							>
								Next
							</Button>
						</div>
					)
				}}
			/>

			<Snackbar
				open={showAlert}
				onClose={() => setShowAlert(false)}
			>
				<Alert severity="error">{alertText}</Alert>
			</Snackbar>
		</div>
	);
}

export default App;
