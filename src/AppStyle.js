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
	spacedButtons: {
		display: "flex",
		justifyContent: "space-between"
	},
	link: {
		color: theme.palette.primary.main
	}
});

export default useStyles;
