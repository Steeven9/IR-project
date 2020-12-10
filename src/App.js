/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable react/display-name */
import { Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
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
			filterPlaceholder: "Link",
			emptyValue: "Unknown",
			render: (rowData) => <a className={classes.link} href={rowData.link} target="_blank" rel="noopener noreferrer">{rowData.link}</a>
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
		searchMovies(keyword, 0, newGenre);
	};

	// Error snackbar at the bottom
	let [showAlert, setShowAlert] = useState(false);
	let [alertText, setAlertText] = useState("");

	// Handle page input change. New index is human-readable (starts from 1)
	const handleIndexChange = (newIndex) => {
		if (!isNaN(newIndex) && newIndex >= 1 && newIndex <= Math.ceil(totalResults / NUM_PER_PAGE) - 1) {
			searchMovies(keyword, newIndex - 1, selectedGenre);
		}
	};

	// Fetch request to retrieve genres list
	const getGenres = () => Axios.get("/solr/movies/genres?q=*:*")
		.then((res) => {
			let arr = res.data.facet_counts.facet_fields.genre;
			let newArr = [];
			
			for (let i = 0; i < arr.length; i += 2) {
				newArr.push({ name: arr[i], count: arr[i + 1]});
			}

			setGenres(newArr);
		})
		.catch((e) => {
			console.error(e);
			setAlertText(e.message);
			setShowAlert(true);
		});	

	// Fetch request to retrieve results
	const searchMovies = (key, pageNumber, genre) => {
		setIsLoading(true);
		
		let query;
		if (genre !== 0 && key) {
			query = key + " AND genre=" + genre;
		} else if (key) {
			query = key;
		} else {
			query = "genre:" + genre;
		}

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

	// Populate genres at page load
	useEffect(() => {getGenres();}, []);

	return (
		<div className={classes.margin20}>
			<div className={classes.dispFlex}>
				<marquee scrolldelay="100" behavior="slide" direction="down" style={{width:"auto"}}><img alt="Logo" src="logo192.png"/></marquee>
				<marquee scrolldelay="10" truespeed="true" behavior="slide"><Typography variant="h1" color="primary">IR project - movie search</Typography></marquee>
			</div>

			<form noValidate autoComplete="off" className={classes.marginVert20 + " " + classes.dispFlex} onSubmit={(evt) => {evt.preventDefault(); searchMovies(keyword, 0, selectedGenre);}}>
				<FormControl className={classes.margin20}>
					<InputLabel>Genre</InputLabel>
					<Select
						value={selectedGenre}
						autoWidth
						onChange={(e) => handleGenreChange(e.target.value)}
					>
						<MenuItem value="0">All genres</MenuItem>
						{genres ? genres.map((el) => <MenuItem key={el.name} value={el.name}>{el.name + " (" + el.count + ")"}</MenuItem>) : null}
					</Select>
				</FormControl>
				
				<TextField 
					className={classes.width80} 
					label="Search by title, description or year" 
					variant="outlined" 
					onChange={(e) => {setKeyword(e.target.value);}}
				/>
				
				<Button 
					variant="contained" 
					color="primary"
					className={classes.margin20}
					onClick={() => {searchMovies(keyword, index, selectedGenre);}}
				>
					Search <Search className={classes.iconSpace}/>
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
										onChange={(e) => {handleIndexChange(e.target.value);}}
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
