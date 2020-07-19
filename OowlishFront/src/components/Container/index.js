import styled from 'styled-components';

export const Container = styled.div`
  max-width: 700px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;
  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  & > h1 > svg {
    margin-right: 10px;
  }
  & > img {
    width: 150px;
    margin: 0 auto;
    display: flex;
  }
  & > a {
    color: #00a4ccff;
    font-size: 16px;
    text-decoration: none;
    &:hover {
      color: #333333;
    }
  }

  & > .MuiPagination-root {
    margin-top: 20px;
  }
`;

export default Container;
