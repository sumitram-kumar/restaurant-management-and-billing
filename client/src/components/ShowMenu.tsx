import { useState } from "react";
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
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { toast } from "react-toastify";
import { useCatalog } from "../context/CatalogContext";
import { deleteMenuItem } from "../api/menu";
import { getErrorMessage } from "../api/errorMessage";
import { useConfirm } from "../context/ConfirmDialogContext";

const SKELETON_ROWS = 5;

const ShowMenu = () => {
  const navigate = useNavigate();
  const { menuItems, isLoading, refreshMenu } = useCatalog();
  const confirm = useConfirm();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (foodId: number, foodName: string) => {
    const confirmed = await confirm({
      title: "Delete menu item?",
      message: `"${foodName}" will be permanently removed from the menu.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!confirmed) return;

    setDeletingId(foodId);
    try {
      await deleteMenuItem(foodId);
      toast.success(`${foodName} deleted successfully`);
      await refreshMenu();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete item"));
    } finally {
      setDeletingId(null);
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
            {isLoading
              ? "Loading..."
              : `${menuItems.length} item${menuItems.length === 1 ? "" : "s"}`}
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
              {isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width="70%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={50} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={50} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={70} sx={{ ml: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                menuItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                    <TableCell>
                      <Chip label={item.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{`₹${item.halfPrice}`}</TableCell>
                    <TableCell align="right">{`₹${item.fullPrice}`}</TableCell>
                    <TableCell align="right">
                      {deletingId === item.id ? (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      ) : (
                        <>
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
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && menuItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <RestaurantMenuRoundedIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                    />
                    <Typography color="text.secondary" gutterBottom>
                      No menu items yet.
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => navigate("/addMenuItem")}
                    >
                      Add your first item
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default ShowMenu;
