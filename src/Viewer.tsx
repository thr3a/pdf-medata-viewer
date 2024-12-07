import { CodeHighlight } from '@mantine/code-highlight';
import { FileInput, Title } from '@mantine/core';
import { Table } from '@mantine/core';
import { Space } from '@mantine/core';
import * as pdfjsLib from 'pdfjs-dist';
import type React from 'react';
import { useState } from 'react';
import '@mantine/code-highlight/styles.css';

// PDFワーカーの設定
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PDFInfo {
  Title?: string;
  Subject?: string;
  Author?: string;
  Language?: string;
  PDFFormatVersion?: string;
  Creator?: string;
  Producer?: string;
  CreationDate: string;
  ModDate?: string;
}

function formatDate(pdfDate: string): string {
  // D:YYYYMMDDHHmmSS±HH'mm' の形式をパース
  const match = pdfDate.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})([-+])(\d{2})'(\d{2})'/);

  if (!match) {
    // throw new Error('Invalid PDF date format');
    // 無理だったらそのまま返す
    return pdfDate;
  }

  const [_, year, month, day, hour, minute, second, tzSign, tzHour, tzMinute] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${tzSign}${tzHour}:${tzMinute}`;
}

const PDFMetadataViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFInfo | null>(null);
  const [rawMetadata, setRawMetadata] = useState<string | null>(null);

  const handleChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      console.log('ファイル名:', file.name);
      extractPDFMetadata(file);
    }
  };

  const extractPDFMetadata = async (file: File) => {
    try {
      // FileをArrayBufferに変換
      const arrayBuffer = await file.arrayBuffer();
      // PDFドキュメントの読み込み
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      // メタデータの取得
      const metadataResult = await pdfDocument.getMetadata();

      setRawMetadata(metadataResult.metadata.getRaw());
      if (metadataResult.info) {
        setMetadata(metadataResult.info as PDFInfo);
      }
    } catch (error) {
      console.error('PDFの解析中にエラーが発生しました:', error);
      setMetadata(null);
    }
  };

  return (
    <div>
      <form>
        <FileInput
          label='PDFファイル'
          placeholder='確認したいPDFファイルを選択してください'
          value={selectedFile}
          accept='application/pdf'
          onChange={handleChange}
        />
      </form>

      {selectedFile && metadata && rawMetadata && (
        <>
          <Space h='md' />
          <Title order={3}>抽出結果</Title>
          <Table withTableBorder withColumnBorders>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>タイトル</Table.Th>
                <Table.Td>{metadata.Title || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>サブジェクト</Table.Th>
                <Table.Td>{metadata.Subject || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>作成者</Table.Th>
                <Table.Td>{metadata.Author || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>言語</Table.Th>
                <Table.Td>{metadata.Language || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>PDFバージョン</Table.Th>
                <Table.Td>{metadata.PDFFormatVersion || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>作成アプリケーション</Table.Th>
                <Table.Td>{metadata.Creator || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>PDF作成ソフト</Table.Th>
                <Table.Td>{metadata.Producer || 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>作成日時</Table.Th>
                <Table.Td>{metadata.CreationDate ? formatDate(metadata.CreationDate) : 'N/A'}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th bg={'gray.1'}>更新日時</Table.Th>
                <Table.Td>{metadata.ModDate ? formatDate(metadata.ModDate) : 'N/A'}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Space h='md' />
          <Title order={3}>Raw Data(XMP)</Title>
          <CodeHighlight code={rawMetadata} language='tsx' />
        </>
      )}
    </div>
  );
};

export default PDFMetadataViewer;
