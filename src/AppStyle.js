import { makeStyles } from "@material-ui/core";
import theme from "./AppTheme";

const useStyles = makeStyles({
	dispFlex: {
		display: "flex",
		alignItems: "center"
	},
	margin20: {
		margin: "20px"
	},
	marginVert20: {
		margin: "20px 0"
	},
	marginSide20: {
		margin: "0 20px"
	},
	spacedButtons: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
	link: {
		color: theme.palette.primary.main
	},
	alignCenter: {
		textAlign: "center"
	}
});

export default useStyles;
