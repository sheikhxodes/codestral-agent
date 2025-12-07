'use client';

import React, { useRef, useEffect } from 'react';
import { Bubble, Sender } from '@ant-design/x';
import { useChat } from 'ai/react';
import { Typography, Space, Card, Alert, Spin } from 'antd';
import { UserOutlined, RobotOutlined, CodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

function CodeResult({ result }: { result: any }) {
  if (!result) return null;
  if (!result.success) {
    return (
      <Alert type="error" message={result.error?.name || 'Execution Error'}
        description={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result.error?.message}{result.error?.traceback && <Text type="secondary">{'\n' + result.error.traceback}</Text>}</pre>}
        icon={<CloseCircleOutlined />} showIcon />
    );
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {result.stdout && <Card size="small" title="Output"><pre style={{ margin: 0 }}>{result.stdout}</pre></Card>}
      {result.results?.map((r: any, i: number) => (
        <div key={i}>
          {r.type === 'image' && <Card size="small" title="Visualization"><img src={`data:image/png;base64,${r.data}`} alt="Output" style={{ maxWidth: '100%' }} /></Card>}
          {r.type === 'text' && <Card size="small"><pre style={{ margin: 0 }}>{r.data}</pre></Card>}
        </div>
      ))}
      {result.success && !result.stdout && !result.results?.length && <Alert type="success" message="Code executed successfully" icon={<CheckCircleOutlined />} showIcon />}
    </Space>
  );
}

function MessageContent({ content, toolInvocations }: { content: string; toolInvocations?: any[] }) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {content && <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{content}</Paragraph>}
      {toolInvocations?.map((tool, i) => (
        <Card key={i} size="small" title={<Space><CodeOutlined /><Text>Python Execution</Text>{tool.state === 'call' && <Spin size="small" />}</Space>} style={{ marginTop: 8 }}>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 6, overflow: 'auto', fontSize: 13 }}>{tool.args?.code}</pre>
          {tool.state === 'result' && <div style={{ marginTop: 12 }}><CodeResult result={tool.result} /></div>}
        </Card>
      ))}
    </Space>
  );
}

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ api: '/api/chat', maxSteps: 5 });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            <RobotOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <Paragraph>Hello! I'm a code-executing AI agent powered by Codestral.</Paragraph>
            <Paragraph type="secondary">Ask me to analyze data, solve problems, or create visualizations.</Paragraph>
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} placement={m.role === 'user' ? 'end' : 'start'}
            avatar={m.role === 'user' ? { icon: <UserOutlined /> } : { icon: <RobotOutlined />, style: { background: '#1890ff' } }}
            content={<MessageContent content={m.content} toolInvocations={m.toolInvocations} />}
            styles={{ content: { maxWidth: '80%' } }} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <Bubble placement="start" avatar={{ icon: <RobotOutlined />, style: { background: '#1890ff' } }} content={<Spin size="small" />} typing />
        )}
        {error && <Alert type="error" message="Error" description={error.message} style={{ margin: '16px 0' }} />}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, background: '#fff' }}>
        <Sender value={input} onChange={(v) => handleInputChange({ target: { value: v } } as any)} onSubmit={() => handleSubmit()}
          placeholder="Ask me to analyze data, solve problems, or create visualizations..." loading={isLoading} disabled={isLoading} />
      </div>
    </div>
  );
}