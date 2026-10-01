import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, useRef } from "react";

export default function SearchWithDebounce({
  onSearch,
  delay = 500,
  placeholder = "Search here",
  className = "",
  ...props
}) {
  const [value, setValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!onSearch) return;

    debounceRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [value, delay, onSearch]);

  const handleClick = () => {
    clearTimeout(debounceRef.current);
    onSearch?.(value.trim());
  };

  return (
    <Box
      {...props}
      className={`d-flex align-items-center w-100 ${className}`}
      sx={{
        border: "1.5px solid #58C99A",
        borderRadius: "14px",
        padding: "6px 8px 6px 16px",
      }}
    >
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          flex: 1,
          fontSize: "16px",
        }}
      />

      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "#58C99A",
          color: "#fff",
          borderRadius: "10px",
          width: 44,
          height: 44,
          ml: 1,
          "&:hover": { backgroundColor: "#58C99A" },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
