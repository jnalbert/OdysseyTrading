import React, { useState } from "react";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import { addUnopendPinsToAccount, InputProps } from "./utils/firebase";

const OverallPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100%; */
`;

const HeaderText = styled.div`
  margin-top: 1%;
  font-weight: 600;
  font-size: 2em;
`;

const LogoWrapper = styled.div`
  margin-top: 0.5%;
  width: 20%;
  justify-content: center;
  align-items: center;
`;

const LogoPicture = styled.img`
  width: 100%;
`;

const TextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50vw;
`;

const TextInputHeader = styled.div`
  font-weight: 600;
  font-size: 1.5em;
  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const NameTextInput = styled.input`
  margin-top: 1%;
  background-color: white;
  padding: 7px;
  border: 2px solid #5fb5bf;
  border-radius: 10px;
  font-size: 1.5em;
`;

const PackInput = styled.input`
  margin-top: 1%;
  width: 15%;
  min-width: 13%;
  background-color: white;
  padding: 7px;
  border: 2px solid #5fb5bf;
  border-radius: 10px;
  font-size: 1.5em;
`;

const ErrorText = styled.div`
  margin-top: 5px;
  color: red;
  font-size: 1em;
`;

const SubmitButtonWrapper = styled.div`
  margin-top: 5%;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  height: 3rem;
  width: 30%;
  border-radius: 10px;
  background-color: #f56d6d;
  @media (max-width: 768px) {
    width: 50%;
  }
`;

const ButtonText = styled.span`
  color: #ffebc2;
  font-size: 1.2em;
  font-weight: 600;
`;

const PackInputWrapper = styled.div`
  margin-top: 3%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 50vw;
`;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<InputProps>();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    setIsFirebaseLoading(true);
    const response = await addUnopendPinsToAccount(data);
    setIsFirebaseLoading(false);
    if (response) {
      // const errorConfig = {type: "custom", message: "User not found check user name"}
      setError("userName", {
        type: "manual",
        message: response,
      });
    } else {
      reset()
    }
  };

  return (
    <OverallPageWrapper style={{ background: "#FFEBC2" }}>
      <LogoWrapper>
        <LogoPicture src={require("./LogoPicture.png")} />
      </LogoWrapper>
      <HeaderText>Odyssey Bloomberg Terminal</HeaderText>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2%" }}>
        <TextInputWrapper>
          <TextInputHeader>UserName</TextInputHeader>
          <NameTextInput
            {...register("userName", { required: "This field is required" })}
          />
          {errors.userName && <ErrorText>{errors.userName.message}</ErrorText>}
        </TextInputWrapper>
        <PackInputWrapper>
          <TextInputHeader style={{ marginRight: "1%" }}>
            2 Pack
          </TextInputHeader>
          <PackInput
            defaultValue={0}
            type={"number"}
            {...register("pack2Count", {
              min: {
                value: 0,
                message: 'Enter a number greater than 0' // JS only: <p>error message</p> TS only support string
              }
            })}
          />
        </PackInputWrapper>
        {errors.pack2Count && (
          <ErrorText>{errors.pack2Count.message}</ErrorText>
        )}
        <PackInputWrapper>
          <TextInputHeader style={{ marginRight: "1%" }}>
            4 Pack
          </TextInputHeader>
          <PackInput
            defaultValue={0}
            type={"number"}
            {...register("pack4Count", {
              min: {
                value: 0,
                message: 'Enter a number greater than 0' // JS only: <p>error message</p> TS only support string
              }
            })}
          />
        </PackInputWrapper>
        {errors.pack4Count && (
          <ErrorText>{errors.pack4Count.message}</ErrorText>
        )}
        <PackInputWrapper>
          <TextInputHeader style={{ marginRight: "1%" }}>
            6 Pack
          </TextInputHeader>
          <PackInput
            defaultValue={0}
            type={"number"}
            {...register("pack6Count", {
              min: {
                value: 0,
                message: 'Enter a number greater than 0' // JS only: <p>error message</p> TS only support string
              }
            })}
          />
        </PackInputWrapper>
        {errors.pack6Count && (
          <ErrorText>{errors.pack6Count.message}</ErrorText>
        )}

        <SubmitButtonWrapper>
          {isFirebaseLoading ? (
            <img
              style={{ height: "15vh" }}
              className="Spinning-Arlo"
              alt="pang Spin"
              src={require("./PangSpin.png")}
            />
          ) : (
            <SubmitButton type="submit">
              <ButtonText>Submit Order</ButtonText>
            </SubmitButton>
          )}
        </SubmitButtonWrapper>
      </form>
    </OverallPageWrapper>
  );
}

export default App;
