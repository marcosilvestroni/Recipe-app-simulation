import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const FormContainer = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`;

export const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  &.space-between {
    justify-content: space-between;
  }
`;

export const ToggleLabel = styled.label`
  margin-right: 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;

  input {
    margin-right: 0.5rem;
  }
`;

export const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background: white;
  z-index: 10;
  box-shadow: var(--shadow-md);
`;

export const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  &:hover {
    background-color: #f5f5f5;
  }
  &:last-child {
    border-bottom: none;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
`;
