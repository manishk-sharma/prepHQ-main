// src/pages/coding/problem/data/problemData.js

const problemData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  topics: ["Array", "Hash Table"],
  likes: 1300,
  dislikes: 89,
  comments: 282,
  description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to target</em>.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
  examples: [
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  testcases: [
    { id: 1, inputs: { nums: "[2,7,11,15]", target: "9" } },
    { id: 2, inputs: { nums: "[3,2,4]", target: "6" } },
  ],
  starterCode: {
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  \n}`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
  },
};

export default problemData;

