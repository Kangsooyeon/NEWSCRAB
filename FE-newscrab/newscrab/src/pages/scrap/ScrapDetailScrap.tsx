import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import { getScrapData } from "@apis/scrap/scrapApi"; // postScrap, putScrap 제거

const Sidebar = styled.div`
  width: 30%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  height: fit-content;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const TabMenu = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 10px 20px;
  background-color: ${({ $active }) => ($active ? "#007BFF" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  min-height: 40px;
  box-sizing: border-box;
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none"};

  &:hover {
    background-color: #007bff;
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const StyledTextarea = styled.textarea<{ $isOverflowing: boolean }>`
  width: 100%;
  height: auto;
  max-height: 570px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
  resize: none;
  background-color: #fff;
  margin-top: 10px;
  white-space: pre-wrap;
  overflow-y: ${({ $isOverflowing }) => ($isOverflowing ? "auto" : "hidden")};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 12px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #666;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  clip-path: inset(0 round 8px);
`;

const ScrapDetailScrap: React.FC<{ scrapId: number }> = ({ scrapId }) => {
  const [, setActiveScrapId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [summaryText, setSummaryText] = useState("");
  const [opinionText, setOpinionText] = useState("");
  const [wordListText, setWordListText] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);

  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const opinionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const wordListTextareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      setIsOverflowing(textarea.scrollHeight > 615);
    }
  };

  // getScrapData를 이용해 서버에서 데이터를 불러오기
  useEffect(() => {
    const fetchScrapData = async () => {
      try {
        const data = await getScrapData(); // 필요한 경우, page와 size를 인자로 전달
        const selectedScrap = data.data.data.find(
          (item) => item.scrapId === scrapId
        );

        if (selectedScrap) {
          setActiveScrapId(selectedScrap.scrapId || null); // scrapId 설정
          setSummaryText(selectedScrap.scrapSummary || "");
          setOpinionText(selectedScrap.comment || "");
          setWordListText(selectedScrap.vocalist?.join(", ") || ""); // vocalist 배열을 문자열로 변환
        }
      } catch (error) {
        console.error("Error fetching scrap data:", error);
      }
    };

    fetchScrapData();
  }, [scrapId]);

  useEffect(() => {
    adjustHeight(summaryTextareaRef.current);
    adjustHeight(opinionTextareaRef.current);
    adjustHeight(wordListTextareaRef.current);
  }, [summaryText, opinionText, wordListText, activeTab]);

  const summaryPlaceholder = `<서론>\n\n<본론>\n\n<결론>`;

  return (
    <Sidebar>
      <TabMenu>
        <TabButton
          $active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
        >
          요약
        </TabButton>
        <TabButton
          $active={activeTab === "opinion"}
          onClick={() => setActiveTab("opinion")}
        >
          의견
        </TabButton>
        <TabButton
          $active={activeTab === "wordlist"}
          onClick={() => setActiveTab("wordlist")}
        >
          단어장
        </TabButton>
      </TabMenu>

      {activeTab === "summary" && (
        <StyledTextarea
          ref={summaryTextareaRef}
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          placeholder={summaryPlaceholder}
          $isOverflowing={isOverflowing}
        />
      )}

      {activeTab === "opinion" && (
        <StyledTextarea
          ref={opinionTextareaRef}
          value={opinionText}
          onChange={(e) => setOpinionText(e.target.value)}
          placeholder="의견을 작성하세요."
          $isOverflowing={isOverflowing}
        />
      )}

      {activeTab === "wordlist" && (
        <StyledTextarea
          ref={wordListTextareaRef}
          value={wordListText}
          onChange={(e) => setWordListText(e.target.value)}
          placeholder="단어장을 작성하세요."
          $isOverflowing={isOverflowing}
        />
      )}
    </Sidebar>
  );
};

export default ScrapDetailScrap;