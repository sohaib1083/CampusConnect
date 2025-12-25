/**
 * RAG (Retrieval Augmented Generation) Service
 * Implements semantic search over university knowledge base
 */

import { KnowledgeItem, universityKnowledgeBase } from '@/data/universityKnowledgeBase';

interface SearchResult {
  item: KnowledgeItem;
  similarity: number;
  relevanceScore: number;
}

/**
 * Simple text similarity calculation using keyword matching and content similarity
 * This is a lightweight alternative to complex vector embeddings for mobile apps
 */
class TextSimilarityCalculator {
  
  /**
   * Calculate similarity between query and knowledge item
   */
  static calculateSimilarity(query: string, item: KnowledgeItem): number {
    const queryLower = query.toLowerCase();
    const questionLower = item.question.toLowerCase();
    const answerLower = item.answer.toLowerCase();
    const topicLower = item.topic.toLowerCase();
    
    let similarity = 0;
    
    // 1. Exact keyword matches (highest weight)
    const queryWords = this.getWords(queryLower);
    const itemKeywords = item.keywords.map(k => k.toLowerCase());
    
    let keywordMatches = 0;
    queryWords.forEach(word => {
      // Improved matching with partial matching and stemming
      if (itemKeywords.some(keyword => 
        keyword.includes(word) || 
        word.includes(keyword) ||
        this.stemWord(keyword) === this.stemWord(word)
      )) {
        keywordMatches++;
      }
    });
    
    similarity += (keywordMatches / queryWords.length) * 0.3; // 30% weight for keywords
    
    // 2. Question similarity (improved)
    const questionWords = this.getWords(questionLower);
    const questionWordMatches = this.countWordMatches(queryWords, questionWords);
    similarity += (questionWordMatches / Math.max(queryWords.length, 1)) * 0.25; // 25% weight
    
    // 3. Topic similarity (improved)
    const topicWords = this.getWords(topicLower);
    const topicWordMatches = this.countWordMatches(queryWords, topicWords);
    similarity += (topicWordMatches / Math.max(queryWords.length, 1)) * 0.25; // 25% weight
    
    // 4. Answer content similarity
    const answerWords = this.getWords(answerLower);
    const answerWordMatches = this.countWordMatches(queryWords, answerWords);
    similarity += (answerWordMatches / Math.max(queryWords.length, 1)) * 0.2; // 20% weight
    
    // 5. Boost for exact phrase matches
    if (questionLower.includes(queryLower) || queryLower.includes(topicLower.replace(/\s+/g, ' '))) {
      similarity += 0.3; // Significant boost for exact matches
    }
    
    return Math.min(similarity, 1.0);
  }
  
  /**
   * Simple word stemming for better matching
   */
  private static stemWord(word: string): string {
    // Simple stemming rules for common suffixes
    const rules = [
      { pattern: /ation$/, replacement: 'ate' },
      { pattern: /ing$/, replacement: '' },
      { pattern: /ed$/, replacement: '' },
      { pattern: /er$/, replacement: '' },
      { pattern: /est$/, replacement: '' },
      { pattern: /s$/, replacement: '' },
    ];
    
    let stemmed = word;
    for (const rule of rules) {
      if (rule.pattern.test(stemmed) && stemmed.length > 4) {
        stemmed = stemmed.replace(rule.pattern, rule.replacement);
        break;
      }
    }
    return stemmed;
  }
  
  /**
   * Extract meaningful words from text (remove common stop words)
   */
  private static getWords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their'
    ]);
    
    return text
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter(Boolean);
  }
  
  /**
   * Count matching words between two word arrays (improved)
   */
  private static countWordMatches(words1: string[], words2: string[]): number {
    let matches = 0;
    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1.includes(word2) || 
            word2.includes(word1) ||
            this.stemWord(word1) === this.stemWord(word2)) {
          matches++;
        }
      });
    });
    return matches;
  }
}

/**
 * RAG Service for retrieving relevant knowledge
 */
export class RAGService {
  
  /**
   * Search for relevant knowledge items based on user query
   */
  static searchRelevantKnowledge(
    query: string, 
    maxResults: number = 3,
    minSimilarity: number = 0.05  // Lowered from 0.1 to 0.05 for better recall
  ): SearchResult[] {
    
    // Calculate similarity scores for all knowledge items
    const results: SearchResult[] = universityKnowledgeBase.map(item => {
      const similarity = TextSimilarityCalculator.calculateSimilarity(query, item);
      
      // Calculate relevance score based on similarity and importance
      let relevanceScore = similarity;
      if (item.importance === 'high') relevanceScore *= 1.3;
      else if (item.importance === 'medium') relevanceScore *= 1.1;
      
      return {
        item,
        similarity,
        relevanceScore
      };
    });
    
    // Filter by minimum similarity and sort by relevance score
    const filteredResults = results
      .filter(result => result.similarity >= minSimilarity)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
    
    return filteredResults;
  }
  
  /**
   * Get context string for RAG-enhanced prompt
   */
  static getContextForPrompt(query: string): string {
    const searchResults = this.searchRelevantKnowledge(query);
    
    if (searchResults.length === 0) {
      return 'No specific university policies found for this query. Provide general guidance based on common Malaysian university practices.';
    }
    
    let context = 'Based on the following university information:\n\n';
    
    searchResults.forEach((result, index) => {
      const { item } = result;
      context += `${index + 1}. **${item.topic}** (${item.category}):\n`;
      context += `   Q: ${item.question}\n`;
      context += `   A: ${item.answer}\n\n`;
    });
    
    context += 'Please provide a comprehensive answer based on the above information, and mention if additional details may apply based on specific circumstances.';
    
    return context;
  }
  
  /**
   * Search by specific category
   */
  static searchByCategory(
    query: string, 
    category: string, 
    maxResults: number = 3
  ): SearchResult[] {
    
    const categoryItems = universityKnowledgeBase.filter(item => 
      item.category.toLowerCase().includes(category.toLowerCase())
    );
    
    const results: SearchResult[] = categoryItems.map(item => {
      const similarity = TextSimilarityCalculator.calculateSimilarity(query, item);
      return {
        item,
        similarity,
        relevanceScore: similarity
      };
    });
    
    return results
      .filter(result => result.similarity > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }
  
  /**
   * Get quick facts for common queries
   */
  static getQuickFacts(): KnowledgeItem[] {
    return universityKnowledgeBase
      .filter(item => item.importance === 'high')
      .slice(0, 5);
  }
  
  /**
   * Search for emergency/urgent information
   */
  static searchUrgentInfo(query: string): SearchResult[] {
    const urgentKeywords = [
      'emergency', 'urgent', 'deadline', 'registration', 'exam', 'appeal', 
      'health', 'medical', 'probation', 'withdrawal', 'graduation'
    ];
    
    const queryLower = query.toLowerCase();
    const isUrgent = urgentKeywords.some(keyword => queryLower.includes(keyword));
    
    if (!isUrgent) {
      return this.searchRelevantKnowledge(query);
    }
    
    // Prioritize high-importance items for urgent queries
    const urgentResults = this.searchRelevantKnowledge(query, 5, 0.05);
    return urgentResults.filter(result => result.item.importance === 'high');
  }
}

/**
 * Helper function to format search results for display
 */
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant information found.';
  }
  
  let formatted = 'Here\'s what I found:\n\n';
  
  results.forEach((result, index) => {
    const { item } = result;
    formatted += `${index + 1}. **${item.topic}**\n`;
    formatted += `${item.answer}\n\n`;
  });
  
  return formatted;
}