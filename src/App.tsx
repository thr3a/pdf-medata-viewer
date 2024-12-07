import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Alert, Anchor, Container, Title } from '@mantine/core';
import PDFMetadataViewer from './Viewer';
import { theme } from './theme';

function Notice() {
  return (
    <Alert variant='light' color='blue' title='外部送信しません' mb={'md'}>
      PDFのメタデータ抽出には
      <a href='https://github.com/mozilla/pdf.js' target='_blank' rel='noreferrer'>
        pdf.js
      </a>
      を使用しており、処理はすべてローカルのブラウザ内で行われます。
      選択したファイルが外部に送信されることは絶対にありません。安心してください。
    </Alert>
  );
}

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container size='sm'>
        <Anchor href='/'>
          <Title mt={'sm'} order={2}>
            PDFメタデータビューアー
          </Title>
        </Anchor>
        <Title order={6} mb={'md'} c={'dimmed'}>
          PDFのメタデータを確認できます。
        </Title>
        <Notice />

        <PDFMetadataViewer />
      </Container>
    </MantineProvider>
  );
}
