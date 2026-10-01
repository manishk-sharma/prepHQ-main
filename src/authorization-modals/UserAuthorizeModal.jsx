import React from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const UserAuthorizeModal = ({ open, close , onLogin }) => {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     close();
//     navigate("/login");
//   };
    
  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <IconButton
        onClick={close}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "text.secondary",
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ py: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#EEF2FF",
              width: 58,
              height: 58,
            }}
          >
            <LockOutlinedIcon
              sx={{
                color: "#2563EB",
                fontSize: 30,
              }}
            />
          </Avatar>

          <Typography variant="h6" fontWeight={700} textAlign="center">
            Login Required
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ lineHeight: 1.8 }}
          >
            You need to be signed in to continue using this feature.
            <br />
          </Typography>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 2,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={close}
        >
          Maybe Later
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<LoginIcon />}
          onClick={onLogin}
          sx={{
            borderRadius: 2,
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAuthorizeModal;
