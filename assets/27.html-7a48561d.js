import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as l,c as d,b as n,d as e,e as t,a as i}from"./app-2bc3c870.js";const c={},a={href:"https://leetcode.cn/problems/remove-element/description/?envType=study-plan-v2&envId=top-interview-150",target:"_blank",rel:"noopener noreferrer"},g=n("code",null,"nums",-1),m=n("code",null,"val",-1),p={href:"https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95",target:"_blank",rel:"noopener noreferrer"},u=n("code",null,"val",-1),v=n("code",null,"O(1)",-1),_={href:"https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95",target:"_blank",rel:"noopener noreferrer"},b=i(`<p>元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。</p><p><strong>说明:</strong></p><p>为什么返回数值是整数，但输出的答案是数组呢?</p><p>请注意，输入数组是以 <strong>「引用」</strong> 方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。</p><p>你可以想象内部操作如下:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// nums 是以“引用”方式传递的。也就是说，不对实参作任何拷贝
int len = removeElement(nums, val);

// 在函数里修改输入数组对于调用者是可见的。
// 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
for (int i = 0; i &lt; len; i++) {
    print(nums[i]);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例 1：</strong></p><pre><strong>输入：</strong>nums = [3,2,2,3], val = 3
<strong>输出：</strong>2, nums = [2,2]
<strong>解释：</strong>函数应该返回新的长度 <strong><code>2</code></strong>, 并且 nums<em></em>中的前两个元素均为 <strong>2</strong>。你不需要考虑数组中超出新长度后面的元素。例如，函数返回的新长度为 2 ，而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。
</pre><p><strong>示例 2：</strong></p><pre><strong>输入：</strong>nums = [0,1,2,2,3,0,4,2], val = 2
<strong>输出：</strong>5, nums = [0,1,3,0,4]
<strong>解释：</strong>函数应该返回新的长度 <strong><code>5</code></strong>, 并且 nums 中的前五个元素为 <strong><code>0</code></strong>, <strong><code>1</code></strong>, <strong><code>3</code></strong>, <strong><code>0</code></strong>, <strong><code>4</code></strong>。注意这五个元素可为任意顺序。你不需要考虑数组中超出新长度后面的元素。
</pre><p><strong>提示：</strong></p><ul><li><code>0 &lt;= nums.length &lt;= 100</code></li><li><code>0 &lt;= nums[i] &lt;= 50</code></li><li><code>0 &lt;= val &lt;= 100</code></li></ul><p>要注意这是一道双指针题目，简单题没啥说的</p>`,13);function h(E,f){const o=r("ExternalLinkIcon");return l(),d("div",null,[n("p",null,[e("该题来自"),n("a",a,[e("力扣27题"),t(o)])]),n("p",null,[e("给你一个数组 "),g,e(" 和一个值 "),m,e("，你需要 "),n("strong",null,[n("a",p,[e("原地"),t(o)])]),e(" 移除所有数值等于 "),u,e(" 的元素，并返回移除后数组的新长度。")]),n("p",null,[e("不要使用额外的数组空间，你必须仅使用 "),v,e(" 额外空间并 "),n("strong",null,[n("a",_,[e("原地 "),t(o)]),e("修改输入数组")]),e(" 。")]),b])}const B=s(c,[["render",h],["__file","27.html.vue"]]);export{B as default};
