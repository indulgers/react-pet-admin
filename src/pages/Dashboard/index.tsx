import React,{ useEffect, useState} from "react";
import { Row, Col } from "antd";
import DemoCard from "./components/DemoCard";
import DemoColumn from "./components/DemoColumn";
import DemoPie from "./components/DemoPie";
import DemoLine from "./components/DemoLine";
import { authLoader } from "@config/router"
import { useNavigate } from "react-router-dom";
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [rerendered, setRerendered] = useState(false);

  useEffect(() => {
    // 在页面挂载后执行 authLoader 函数
    authLoader();


    
  }, []); // 将 navigate 和 rerendered 状态作为依赖

  return (
    <React.Fragment>
      <DemoCard />
      <Row wrap style={{ marginTop: 20 }}>
        <Col span={24} style={{ background: "white", padding: 10 }}>
          <DemoLine />
        </Col>
      </Row>
      <Row wrap style={{ marginTop: 20 }} justify="space-between">
        <Col style={{ background: "white", padding: 10, width: "49%" }}>
          <DemoColumn />
        </Col>
        <Col style={{ background: "white", padding: 10, width: "49%" }}>
          <DemoPie />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
