# services/serp_service.py
import requests
from typing import Dict, List, Any
import streamlit as st
class SerpService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://serpapi.com/search"
    
    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """Search using SerpAPI"""
        try:
            params = {
                'q': query,
                'api_key': self.api_key,
                'engine': 'google',
                'num': num_results,
                'format': 'json'
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            # Extract organic results
            if 'organic_results' in data:
                for result in data['organic_results']:
                    results.append({
                        'title': result.get('title', ''),
                        'link': result.get('link', ''),
                        'snippet': result.get('snippet', ''),
                        'position': result.get('position', 0)
                    })
            
            return results
        except Exception as e:
            st.error(f"Search failed: {e}")
            return []
    
    def search_news(self, query: str, num_results: int = 3) -> List[Dict[str, Any]]:
        """Search for news articles"""
        try:
            params = {
                'q': query,
                'api_key': self.api_key,
                'engine': 'google_news',
                'num': num_results,
                'format': 'json'
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            if 'news_results' in data:
                for result in data['news_results']:
                    results.append({
                        'title': result.get('title', ''),
                        'link': result.get('link', ''),
                        'snippet': result.get('snippet', ''),
                        'date': result.get('date', ''),
                        'source': result.get('source', '')
                    })
            
            return results
        except Exception as e:
            st.error(f"News search failed: {e}")
            return []