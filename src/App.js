/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable react/display-name */
import { AppBar, Box, Button, Snackbar, Tab, Tabs, TextField, Typography } from "@material-ui/core";
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

	// Tabs stuff
	function TabPanel(props) {
		const { children, value, index, ...other } = props;
	
		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<Box p={3}>
						{children}
					</Box>
				)}
			</div>
		);
	}

	function a11yProps(i) {
		return {
			id: `simple-tab-${i}`,
			"aria-controls": `simple-tabpanel-${i}`,
		};
	}

	const [value, setValue] = useState(0);
	//const [genreIndex, setGenreIndex] = useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// Fetch request to retrieve results
	const searchMovies = (pageNumber, genre) => {
		setIsLoading(true);
		let genreQuery = genre ? "&genre=*" + genre : "*";

		if (keyword.length === 0) {
			setTableData([]);
			setIsLoading(false);
		} else if (pageNumber >= 0) {
			Axios.get("/solr/movies/select?q=*" + keyword + "*&sort=title%20asc&start=" + (NUM_PER_PAGE * pageNumber) + genreQuery)
				.then((res) => {
					setTableData(res.data.response.docs);
					setTotalResults(res.data.response.numFound);
					setIsLoading(false);
					setIndex(pageNumber);
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

			<AppBar position="static">
				<Tabs value={value} onChange={handleChange}>
					<Tab label="Search" {...a11yProps(0)} />
					<Tab label="Browse" {...a11yProps(1)} />
				</Tabs>
			</AppBar>

			<TabPanel value={value} index={0}>
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
			</TabPanel>
			<TabPanel value={value} index={1}>
				Work in progress
			</TabPanel>

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
