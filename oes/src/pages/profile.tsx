import { Avatar, Button, Descriptions, Upload } from "antd";
import styled from "styled-components";
import { Box, Title } from "../components/Box";
import { ContentWrapper } from "../components/ContentWrapper";
import { useAuth } from "../hooks/useAuth";
import randomColor from "randomcolor";
import { dayjs } from "../../server/utils/dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { useFetch } from "../hooks/useFetch";
import { uploadIcon } from "../services/userApi/uploadIcon";

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const { fetchData: handleUploadIcon } = useFetch(uploadIcon);

  const { open, getRootProps, getInputProps } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: "image/*",
    onDropAccepted: async (file) => {
      const { success } = await handleUploadIcon(file[0]);
      success && fetchUser();
      window.location.reload();
    },
  });
  
  return (
    <ContentWrapper>
      {user && (
        <Box>
          <Title>Profile</Title>
          <UserInfo>
            <AvatarWrapper>
              <Avatar
                style={{
                  backgroundColor: randomColor({ seed: user.username }),
                  verticalAlign: "middle",
                  fontSize: "40px",
                }}
                size={200}
                src={`/uploads/icons/${user._id}`}
              >
                {user.username}
              </Avatar>
            </AvatarWrapper>
            <InfoWrapper>
              <Descriptions column={1}>
                <Descriptions.Item label="User ID">
                  {user._id}
                </Descriptions.Item>
                <Descriptions.Item label="UserName">
                  {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Tier">{user.tier}</Descriptions.Item>
                <Descriptions.Item label="Create Time">
                  {dayjs(user.createdAt).format("YYYY-MM-DD")}
                </Descriptions.Item>
              </Descriptions>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button icon={<UploadOutlined />} onClick={() => open()}>
                  Upload Icon
                </Button>
              </div>
            </InfoWrapper>
          </UserInfo>
        </Box>
      )}
    </ContentWrapper>
  );
};

export default Profile;

const UserInfo = styled.div`
  width: 100%;
  display: flex;
`;

const AvatarWrapper = styled.div`
  flex-shrink: 0;
  padding: 24px;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;
`;
