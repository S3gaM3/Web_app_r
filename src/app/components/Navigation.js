import React from "react";
import { Box, Typography, Stack, Button, Tooltip } from "@mui/material";

function Navigation({ activeTable, setActiveTable, navItems }) {
    return (
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          bgcolor: "background.paper",
          zIndex: 1000,
          boxShadow: 1,
          py: 1,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1">
            Управление базой данных
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
            {navItems.map(({ id, label, icon }) => (
              <Tooltip key={id} title={label} arrow>
                <Button
                  variant={activeTable === id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setActiveTable(id)}
                  startIcon={icon}
                >
                  {label}
                </Button>
              </Tooltip>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  }
  

export default Navigation;
