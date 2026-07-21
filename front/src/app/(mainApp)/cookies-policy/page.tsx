"use client";

import { Col, Row, Spin, Typography } from "antd";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { useGetCookiesPolicyQuery } from "@/services/Base/base";

import s from "./style.module.scss";

const CookiesPolicyPage = () => {

    const { currentData: policy, isLoading } = useGetCookiesPolicyQuery();

    return (
        <div className={s.policy}>
            <Row style={{ margin: 0 }} gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title>Политика обработки файлов Cookie</Typography.Title>
                </Col>
                <Col span={24}>
                    {isLoading ?
                        <Row justify={"center"}>
                            <Col span={24}>
                                <Spin />
                            </Col>
                        </Row> :
                        <Markdown className={s.markdown} rehypePlugins={[rehypeRaw]}>
                            {policy?.value}
                        </Markdown>
                    }
                </Col>
            </Row>
        </div>
    );
};

export default CookiesPolicyPage;
