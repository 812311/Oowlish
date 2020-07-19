import styled from 'styled-components';

export const Loading = styled.div`
  color: #ffa500;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30vh;
  & > span {
    margin-bottom: 30px;
  }
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }
  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
  a {
    color: #00a4ccff;
    font-size: 16px;
    text-decoration: none;
    &:hover {
      color: #333333;
    }
  }
`;

export const OpenRepository = styled.div`
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #eeeeee;
  display: flex;
  justify-content: center;

  a {
    background: #00a4ccff;
    padding: 15px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;

    color: #ffffff;
    &:hover {
      color: #333333;
    }
  }
`;
