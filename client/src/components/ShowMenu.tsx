import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { toast } from "react-toastify";
import { useCatalog } from "../context/CatalogContext";
import { deleteMenuItem } from "../api/menu";
import { getErrorMessage } from "../api/errorMessage";

const ShowMenu = () => {
  const navigate = useNavigate();
  const { menuItems, refreshMenu } = useCatalog();

  const handleDelete = async (foodId: number, foodName: string) => {
    if (!window.confirm(`Are you sure? ${foodName} will be deleted!`)) return;

    try {
      await deleteMenuItem(foodId);
      toast.success(`${foodName} Deleted Successfully!`);
      await refreshMenu();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete item"));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/addMenuItem")}
        >
          Add Item
        </Button>
      </Box>

      <Card>
        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Food Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Half Price</TableCell>
                <TableCell align="right">Full Price</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{`₹${item.halfPrice}`}</TableCell>
                  <TableCell align="right">{`₹${item.fullPrice}`}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/editMenuItem/${item.id}`)}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default ShowMenu;
