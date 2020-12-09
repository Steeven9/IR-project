/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable react/display-name */
import { Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Tab, Tabs, TextField, Typography } from "@material-ui/core";
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
						alt={rowData.title + " poster"}
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
			emptyValue: "Not available"
		},
		{
			title: "Link",
			field: "link",
			filtering: false,
			emptyValue: "Unknown",
			render: (rowData) => <a className={classes.link} href={rowData.link} rel="noopener noreferrer">{rowData.link}</a>
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

	// Genre selection and list
	let [genres, setGenres] = useState([]);
	let [selectedGenre, setSelectedGenre] = useState(0);

	const handleGenreChange = (newGenre) => {
		setSelectedGenre(newGenre);
		searchMovies("", 0, newGenre);
	};

	// Error snackbar at the bottom
	let [showAlert, setShowAlert] = useState(false);
	let [alertText, setAlertText] = useState("");

	// Tabs index
	const [selectedTab, setselectedTab] = useState(0);
	const handleTabChange = (event, newValue) => {
		setselectedTab(newValue);
		setSelectedGenre(0);
		setTableData([]);
		getGenres();
		setIndex(0);
		setTotalResults(0);
	};

	// Fetch request to retrieve genres list
	const getGenres = () => Axios.get("/solr/movies/genres")
		.then((res) => {
			setGenres(res.data.facet_counts.facet_fields.genre.filter((el) => el !== 0));
		})
		.catch((e) => {
			console.error(e);
			setAlertText(e.message);
			setShowAlert(true);
		});	

	// Fetch request to retrieve results
	const searchMovies = (key, pageNumber, genre) => {
		setIsLoading(true);
		let query = genre !== 0 ? "genre:" + genre : "*" + key + "*";

		if (key.length === 0 && !genre) {
			setTableData([]);
			setIsLoading(false);
			setIndex(0);
			setTotalResults(0);
		} else if (pageNumber >= 0) {
			Axios.get("/solr/movies/select?q=" + query + "&sort=title%20asc&start=" + (NUM_PER_PAGE * pageNumber))
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

			<Tabs
				value={selectedTab}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleTabChange}
			>
				<Tab label="Search" />
				<Tab label="Browse" />
			</Tabs>

			{ selectedTab === 0 ? (
				<form noValidate autoComplete="off" className={classes.marginVert20 + " " + classes.dispFlex} onSubmit={(evt) => {evt.preventDefault(); searchMovies(keyword, 0, 0);}}>
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
						onClick={() => {searchMovies(keyword, index, 0);}}
					>
						Search <Search />
					</Button>
				</form>
			) : (
				<FormControl className={classes.margin20}>
					<InputLabel>Genre</InputLabel>
					<Select
						value={selectedGenre}
						autoWidth
						onChange={(e) => handleGenreChange(e.target.value)}
					>
						<MenuItem value="0">Choose...</MenuItem>
						{genres ? genres.map((el) => <MenuItem key={el} value={el}>{el}</MenuItem>) : null}
					</Select>
				</FormControl>
			)}

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
								onClick={() => {searchMovies(keyword, index - 1, selectedGenre);}}
							>
								Prev
							</Button>

							<div className={classes.margin20 + " " + classes.spacedButtons}>
								{totalResults === 0 ? "" : (<>
									<Typography>Page </Typography>
									<TextField 
										value={index + 1} 
										inputProps={{style: { textAlign: "center" }}}
										className={classes.marginSide20} 
										onChange={(e) => {searchMovies(keyword, e.target.value - 1, selectedGenre);}}
									/> 
									<Typography> of {Math.ceil(totalResults / NUM_PER_PAGE)}</Typography>
								</>)}
							</div>
							
							<Button 
								variant="contained" 
								color="primary"
								disabled={index >= Math.ceil(totalResults / NUM_PER_PAGE) - 1}
								className={classes.margin20}
								onClick={() => {searchMovies(keyword, index + 1, selectedGenre);}}
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
