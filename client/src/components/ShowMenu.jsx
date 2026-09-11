import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "./styles/ShowMenu.css";
import Navbar from "./Navbar";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useCatalog } from "../context/CatalogContext";
import { deleteMenuItem } from "../api/menu";

const ShowMenu = () => {
  const navigate = useNavigate();
  const { menuItems, refreshMenu } = useCatalog();

  const handleDelete = async (foodId, foodName) => {
    if (!window.confirm(`Are you sure? ${foodName} will be deleted!`)) return;

    try {
      await deleteMenuItem(foodId);
      toast.success(`${foodName} Deleted Successfully!`);
      await refreshMenu();
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to delete item");
    }
  };

  return (
    <div>
      <div className="navbar">
        <Navbar showText="MENU" />
      </div>
      <div className="paper">
        <Paper
          sx={{
            width: "75%",
            overflow: "hidden",
            textAlign: "center",
            margin: "auto",
          }}
        >
          <TableContainer sx={{ maxHeight: "40rem" }} className="paper-cont">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className="menuTb">Food Id</TableCell>
                  <TableCell className="menuTb" align="center">
                    Food Name
                  </TableCell>
                  <TableCell className="menuTb" align="center">
                    Category
                  </TableCell>
                  <TableCell className="menuTb" align="center">
                    Half Price
                  </TableCell>
                  <TableCell className="menuTb" align="center">
                    Full Price
                  </TableCell>
                  <TableCell className="menuTb" align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className="first-col">
                      {item.id}
                    </TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.category}</TableCell>
                    <TableCell align="center">{item.halfPrice}</TableCell>
                    <TableCell align="center">{item.fullPrice}</TableCell>
                    <TableCell align="center">
                      <Button
                        className="tableBtn-edit"
                        color="success"
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/editMenuItem/${item.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="tableBtn-del"
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <br></br>
        <Button
          className="menuAdd"
          color="success"
          variant="contained"
          size="large"
          onClick={() => navigate("/addMenuItem")}
        >
          ADD ITEM
        </Button>
      </div>
      <div>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation sx={{ backgroundColor: "primary.main" }} />
        </Paper>
      </div>
    </div>
  );
};

export default ShowMenu;
