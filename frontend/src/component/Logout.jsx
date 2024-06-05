import React from "react";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import styled from "styled-components";
import Swal from "sweetalert2";

export default function Logout() {

  const navigate = useNavigate();
  const handleClick = async () => {
    const tellme = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to log out ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log out",
      width: "25rem"
    });
    if (!tellme.value) return;

      localStorage.clear();
      navigate("/login");
    };
  return (
    <Button onClick={handleClick}>
      <RiLogoutCircleLine />;
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:black;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  svg {
    font-size: 2rem;
    color:white;
  }
`;
