import styled from "styled-components";

export const Box = styled.div<{ padding?: boolean }>`
  background-color: #fff;
  box-shadow: 0 0 3.6px 0 rgba(0, 0, 0, 0.132), 0 0 0.9px 0 rgba(0, 0, 0, 0.108);
  border-radius: 2px;
  ${({ padding = true }) => (padding ? "padding: 16px" : "")}
`;

export const Title = styled.h1``;
