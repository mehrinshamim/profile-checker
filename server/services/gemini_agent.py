# services/gemini_agent.py
import google.generativeai as genai
from typing import Dict, List, Any, Optional
import json
import re
import streamlit as st
from .serp_service import SerpService

class GeminiAgent:
    def __init__(self, api_key: str, serp_api_key: str):
        """Initialize Gemini Agent with ReAct capabilities"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.serp_service = SerpService(serp_api_key)
        self.max_iterations = 5
        
        self.system_prompt = """
You are an intelligent research assistant that uses a ReAct (Reasoning + Acting) approach to analyze text extracted from images.

TOOLS AVAILABLE:
- search(query): Search the web for information
- search_news(query): Search for recent news articles

INSTRUCTIONS:
1. Think about what information you need to gather
2. Use available tools to search for relevant information
3. Observe the results and decide if you need more information
4. Continue until you have comprehensive information
5. Provide a final summary with your findings

FORMAT:
Thought: [Your reasoning about what to do next]
Action: [tool_name(query)]
Observation: [Results from the tool]
... (repeat as needed)
Final Answer: [Comprehensive summary of findings]

IMPORTANT:
- Always start with a Thought
- Use specific, targeted search queries
- Analyze the extracted text to identify key entities, places, events, or topics
- Search for context, background information, recent developments
- Provide factual, well-researched information
"""
    
    def _parse_action(self, text: str) -> Optional[Dict[str, str]]:
        """Parse action from agent response"""
        action_pattern = r'Action:\s*(\w+)\((.*?)\)'
        match = re.search(action_pattern, text)
        
        if match:
            tool_name = match.group(1)
            query = match.group(2).strip('"\'')
            return {'tool': tool_name, 'query': query}
        return None
    
    def _execute_action(self, action: Dict[str, str]) -> str:
        """Execute the parsed action"""
        tool = action['tool']
        query = action['query']
        
        if tool == 'search':
            results = self.serp_service.search(query, num_results=3)
            return self._format_search_results(results)
        elif tool == 'search_news':
            results = self.serp_service.search_news(query, num_results=3)
            return self._format_news_results(results)
        else:
            return f"Unknown tool: {tool}"
    
    def _format_search_results(self, results: List[Dict[str, Any]]) -> str:
        """Format search results for the agent"""
        if not results:
            return "No search results found."
        
        formatted = "Search Results:\n"
        for i, result in enumerate(results, 1):
            formatted += f"{i}. {result['title']}\n"
            formatted += f"   {result['snippet']}\n"
            formatted += f"   URL: {result['link']}\n\n"
        
        return formatted
    
    def _format_news_results(self, results: List[Dict[str, Any]]) -> str:
        """Format news results for the agent"""
        if not results:
            return "No news results found."
        
        formatted = "News Results:\n"
        for i, result in enumerate(results, 1):
            formatted += f"{i}. {result['title']}\n"
            formatted += f"   {result['snippet']}\n"
            formatted += f"   Source: {result['source']} | Date: {result['date']}\n"
            formatted += f"   URL: {result['link']}\n\n"
        
        return formatted
    
    def analyze_text(self, extracted_text: str) -> Dict[str, Any]:
        """Analyze extracted text using ReAct pattern"""
        conversation_history = []
        
        # Initial prompt
        initial_prompt = f"""
{self.system_prompt}

EXTRACTED TEXT FROM IMAGE:
{extracted_text}

Please analyze this text and use the available tools to gather comprehensive information about the content. Start with your first Thought.
"""
        
        conversation_history.append(initial_prompt)
        
        iterations = 0
        final_answer = ""
        
        progress_placeholder = st.empty()
        details_placeholder = st.empty()
        
        while iterations < self.max_iterations:
            iterations += 1
            
            progress_placeholder.info(f"🤔 Agent Iteration {iterations}/{self.max_iterations}")
            
            try:
                # Get response from Gemini
                full_prompt = "\n\n".join(conversation_history)
                response = self.model.generate_content(full_prompt)
                agent_response = response.text
                
                conversation_history.append(agent_response)
                
                # Display current thinking
                with details_placeholder.expander(f"🔍 Iteration {iterations} Details"):
                    st.text(agent_response)
                
                # Check if we have a final answer
                if "Final Answer:" in agent_response:
                    final_answer = agent_response.split("Final Answer:")[-1].strip()
                    break
                
                # Parse and execute action
                action = self._parse_action(agent_response)
                if action:
                    st.info(f"🔍 Searching: {action['query']}")
                    observation = self._execute_action(action)
                    conversation_history.append(f"Observation: {observation}")
                else:
                    # No action found, ask for next step
                    conversation_history.append("Please continue with your next Thought or provide your Final Answer.")
                
            except Exception as e:
                st.error(f"Error in iteration {iterations}: {e}")
                break
        
        progress_placeholder.success("✅ Analysis Complete!")
        
        return {
            'final_answer': final_answer,
            'iterations': iterations,
            'conversation_history': conversation_history
        }
    
    def quick_analyze(self, extracted_text: str) -> str:
        """Quick analysis without ReAct pattern for simple cases"""
        try:
            prompt = f"""
Analyze the following text extracted from an image and provide a brief summary of what it contains:

TEXT: {extracted_text}

Please identify:
1. What type of content this appears to be
2. Key information or entities mentioned
3. Any important details or context

Keep the response concise but informative.
"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            st.error(f"Quick analysis failed: {e}")
            return "Analysis failed."