import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import XLSX from 'sheetjs-style';
import {
  Image,
  Flex,
  Text,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Stack,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { BsClipboardCheck } from "react-icons/bs";
import { PhoneIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import NoData from "../Assets/Images/NoData.svg";
import { Link } from "react-router-dom";
import axios from "../axios";
import TeacherProfileImage from "../Assets/Images/TeacherProfile.svg";
import TeacherSubjectSection from "./TeacherSubjectSection";
import { useSnackbar } from "notistack";

const TeacherClassSection = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state?.user);
  const [classData, setClassData] = useState();
  const [studentData, setClassStudentData] = useState();
  const [teacherID, setTeacherID] = useState();
  const [allTeachersData, setAllTeachers] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: allTeachers,
    onOpen: onOpenAllTeachers,
    onClose: onCloseAllTeachers,
  } = useDisclosure();
  const {
    isOpen: group,
    onOpen: onOpenGroup,
    onClose: onCloseGroup,
  } = useDisclosure();
  const {
    isOpen: member,
    onOpen: onOpenMembers,
    onClose: onCloseMembers,
  } = useDisclosure();
  const {
    isOpen: isOpenAddTeacher,
    onOpen: onOpenAddTeacher,
    onClose: onCloseAddTeacher,
  } = useDisclosure();
  const token = localStorage.getItem("token");

  const getClassData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `/teacher/getClass`,
        headers: {
          Authorization: token,
        },
      });
      setClassData(response.data.classDetails);
    } catch (error) {
      console.log(error);
    }
  };


  const addTeacher = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: `/teacher/addTeacherToClass`,
        headers: {
          Authorization: token,
        },
        data: {
          teacherID,
          classID: classData?._id,
        },
      });
      setAllTeachers(response?.data?.getTeachers);
      enqueueSnackbar(response.data.message, { variant: "success" });
      onCloseAddTeacher();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something Went Wrong", { variant: "error" });
    }
  };

  const getAllTeachers = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `/teacher/getAllTeachers`,
        headers: {
          Authorization: token,
        },
      });
      setAllTeachers(response.data.getTeachers);
    } catch (error) {
      console.log(error);
    }
  };

  const getClassStudentData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `/teacher/getAllStudentsInClass`,
        headers: {
          Authorization: token,
        },
      });
      setClassStudentData(response.data.studentsJoined);
    } catch (error) {
      console.log(error);
    }
  };

  const [membersData,setMembers] = useState()

  const setGroupMembers=async(groupID)=>{
      const gp = classData.groups.find(g=>g._id ==groupID)
      console.log(gp,"GSHFHF")
      setMembers(gp.members);
      onOpenMembers()
  }

  

  useEffect(() => {
    getClassData();
    getClassStudentData();
    getAllTeachers();
  }, []);

  console.log("HERE", classData);

  const  handleExportToExcel = () =>  {
    let data = [];

      classData?.groups.forEach((group) => {
      group.members.forEach((member) => {
      data.push({
      groupName: group.name,
      groupLeaderName: group?.groupLeader?.name,
      memberName: member.name,
      memberPhone: member.phone,
      memberEmail: member.email,
    });
  });
}); 


        
        console.log(data);
        console.log(classData)
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const headerStyle = { font: { bold: true } };
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let i = headerRange.s.c; i <= headerRange.e.c; i++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    worksheet[cellAddress].s = headerStyle;
}
    
//    
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "FF-105.xlsx");
    } 
  return (
    <>

      {classData ? (
        <>
        {/* <Excel/> */}
          <Flex justify={"center"}>
            <Box>
              <Text mt={"4rem"} fontSize={"2.1rem"} fontWeight={"bold"}>
                Class Details
              </Text>
            </Box>
          </Flex>
          <Box mt={"2rem"}>
            <Flex
              ml={"auto"}
              mr={"auto"}
              wrap={"wrap"}
              justify={"start"}
              height={"250px"}
              w={"80%"}
            >
              <Box width={"400px"}>
                <Image src={TeacherProfileImage} width={"350px"}></Image>
              </Box>
              <Box maxWidth={"720px"}>
                <Flex align={"center"}>
                  <Text fontSize={"1.3rem"} mr={"0.4rem"} fontWeight={"medium"}>
                    Title:{" "}
                  </Text>
                  <Text fontSize={"1.3rem"}>{classData?.title}</Text>
                </Flex>

                <Flex align={"center"}>
                  <Text fontSize={"1.3rem"} mr={"0.4rem"} fontWeight={"medium"}>
                    Description:{" "}
                  </Text>
                  <Text fontSize={"1.3rem"}>{classData?.description}</Text>
                </Flex>

                <Flex align={"center"}>
                  <Flex justify={"center"} align={"center"}>
                    <Text
                      fontSize={"1.3rem"}
                      mr={"0.4rem"}
                      fontWeight={"medium"}
                    >
                      Class ID:{" "}
                    </Text>
                    <Text fontSize={"1.3rem"} mr={"0.5rem"}>
                      {classData?._id}
                    </Text>
                    <BsClipboardCheck
                      color="grey"
                      size={"1.2rem"}
                      onClick={() => {
                        navigator.clipboard.writeText(`${classData?._id}`);
                        enqueueSnackbar(
                          `${classData?._id} Copied To Clipboard`,
                          { variant: "warning" }
                        );
                      }}
                      title={"CLICK HERE TO COPY TO CLIPBOARD"}
                      id={"checkicon"}
                    />
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Flex justify={"center"} wrap={"wrap"}>
            <Box mt={"5rem"}>
              <Button
                m={"1rem"}
                w={"200px"}
                height={"3.5rem"}
                colorScheme={"purple"}
                onClick={onOpen}
              >
                View Joined Students
              </Button>
              <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>List of Students In Class </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Phone</Th>
                            <Th> Group Number</Th>
                            <Th> Remove</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {studentData?.map((student) => {
                            return (
                              <>
                                <Tr key={student._id}>
                                  <Td>{student._id}</Td>
                                  <Td>{student.name}</Td>
                                  <Td>{student.phone}</Td>
                                  {student?.groupDetails?.groupID?.name ? (
                                    <>
                                      <Td>
                                        {student?.groupDetails?.groupID?.name}
                                      </Td>
                                    </>
                                  ) : (
                                    <>
                                      <Td textColor={"red"}>Not Joined</Td>
                                    </>
                                  )}
                                  <Td>
                                    <CloseIcon
                                      id="checkicon"
                                      color={"red"}
                                      backgroundColor={"red.200"}
                                      p={1}
                                      borderRadius={2}
                                      boxSize={6}
                                    />
                                  </Td>
                                </Tr>
                              </>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Button
                onClick={onOpenAllTeachers}
                height={"3.5rem"}
                colorScheme={"yellow"}
                m={"1rem"}
                w={"200px"}
              >
                Show All Teachers
              </Button>
              <Modal
                size={"4xl"}
                isOpen={allTeachers}
                onClose={onCloseAllTeachers}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>List of Teachers In Class </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Phone</Th>
                            <Th> Email</Th>
                            <Th> Remove</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {classData?.teachers.map((teacher) => {
                            
                            return (
                              <Tr>
                                <Td>{teacher._id}</Td>
                                <Td>{teacher.name}</Td>
                                <Td>{teacher.phone}</Td>
                                <Td>{teacher.email}</Td>
                                <Td>
                                  <CloseIcon
                                    id="checkicon"
                                    color={"red"}
                                    backgroundColor={"red.200"}
                                    p={1}
                                    borderRadius={2}
                                    boxSize={6}
                                  />
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={onCloseAllTeachers}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Button
                m={"1rem"}
                colorScheme={"red"}
                height={"3.5rem"}
                w={"200px"}
                onClick={()=>{
                  onOpenGroup()
                }}>
                View All Groups
              </Button>
              <Modal size={"4xl"} isOpen={group} onClose={onCloseGroup}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>List of Groups In Class </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Leader</Th>
                            <Th> Member List</Th>
                            <Th> Remove</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {classData?.groups.map((group) => {
                            return (
                              <Tr>
                                <Td>{group._id}</Td>
                                <Td>{group.name}</Td>
                                <Td>{group?.groupLeader?.name}</Td>
                                <Td>
                                  <Button
                                    size={"sm"}
                                    onClick={()=>{
                                      console.log("HEGWGWRG")
                                      // setMembers(group.members)
                                      setGroupMembers(group._id)
                                    }
                                  }
                                    colorScheme={"teal"}
                                    
                                  >
                                    Show Members
                                  </Button>
                                </Td>
                                <Td>
                                  <CloseIcon
                                    id="checkicon"
                                    color={"red"}
                                    backgroundColor={"red.200"}
                                    p={1}
                                    borderRadius={2}
                                    boxSize={6}
                                  />
                                </Td>
                                
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </ModalBody>
                  <ModalFooter>
                  <Button colorScheme="green" mr={3} onClick={handleExportToExcel}>
                      Generate FF-105
                    </Button>
                    <Button colorScheme="blue" mr={3} onClick={onCloseGroup}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal
                                  isOpen={member}
                                  size={"3xl"}
                                  onClose={onCloseMembers}
                                >
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader>
                                      List of Group Members
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <TableContainer>
                                        <Table variant="simple">
                                          <Thead>
                                            <Tr>
                                              <Th>ID</Th>
                                              <Th>Name</Th>
                                              <Th>Phone</Th>
                                              <Th> Remove</Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {membersData?.map((member) => {
                                                console.log("member",member)
                                              return (
                                                <Tr>
                                                  <Td>{member?._id}</Td>
                                                  <Td>{member?.name}</Td>
                                                  <Td>{member?.phone}</Td>
                                                  <Td>
                                                    <CloseIcon
                                                      id="checkicon"
                                                      color={"red"}
                                                      backgroundColor={
                                                        "red.200"
                                                      }
                                                      p={1}
                                                      borderRadius={2}
                                                      boxSize={6}
                                                    />
                                                  </Td>
                                                </Tr>
                                              );
                                            })}
                                          </Tbody>
                                        </Table>
                                      </TableContainer>
                                    </ModalBody>

                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onCloseMembers}
                                      >
                                        Close
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>

              <Button
                m={"1rem"}
                colorScheme={"green"}
                height={"3.5rem"}
                w={"200px"}
                onClick={onOpenAddTeacher}
              >
                Add Teacher
              </Button>
              <Modal isOpen={isOpenAddTeacher} onClose={onCloseAddTeacher}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Select Teacher</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Stack spacing={4}>
                      <Select
                        onChange={(e) => setTeacherID(e.target.value)}
                        placeholder="Select Subject Teacher"
                      >
                        {allTeachersData?.map((teacher) => {
                          return (
                            <option value={`${teacher._id}`}>
                              ID: {teacher._id}{" "}
                              <Text fontWeight={"extrabold"}>
                                ( {teacher.name} )
                              </Text>
                            </option>
                          );
                        })}
                      </Select>
                    </Stack>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme={"green"} onClick={() => addTeacher()}>
                      Add Teacher To Class
                    </Button>
                    <Button
                      colorScheme="blue"
                      ml={3}
                      onClick={onCloseAddTeacher}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
            <TeacherSubjectSection />
          </Flex>
        </>
      ) : (
        <>
          <Flex direction={"column"} justify={"center"} align={"center"}>
            <Image my={"3rem"} src={NoData} w={"25%"}></Image>
            <Text my={"2rem"} fontSize="1.5rem">
              You haven't made any classes yet. Make a class and start teaching
              !
            </Text>
            <Link to="/teacher/createClass">
              <Button
                m={"2rem"}
                height={"3rem"}
                fontSize={"1.2rem"}
                fontWeight={"bold"}
                colorScheme={"teal"}
              >
                Create A Class
              </Button>
            </Link>
          </Flex>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>dfhhf</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default TeacherClassSection;
