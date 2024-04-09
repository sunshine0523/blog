import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as l,c as i,b as n,d as e,e as r,a as d}from"./app-2bc3c870.js";const c={},a={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/?envType=study-plan-v2&envId=top-interview-150",target:"_blank",rel:"noopener noreferrer"},p={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-array/?envType=study-plan-v2&envId=top-interview-150",target:"_blank",rel:"noopener noreferrer"},u=n("p",null,"需要具备双指针的思想，逻辑和26题完全一样。",-1),g=n("code",null,"nums",-1),m={href:"http://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95",target:"_blank",rel:"noopener noreferrer"},_=n("strong",null,"只出现两次",-1),v={href:"https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95",target:"_blank",rel:"noopener noreferrer"},h=d(`<p><strong>说明：</strong></p><p>为什么返回数值是整数，但输出的答案是数组呢？</p><p>请注意，输入数组是以 <strong>「引用」</strong> 方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。</p><p>你可以想象内部操作如下:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// nums 是以“引用”方式传递的。也就是说，不对实参做任何拷贝
int len = removeDuplicates(nums);

// 在函数里修改输入数组对于调用者是可见的。
// 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
for (int i = 0; i &lt; len; i++) {
    print(nums[i]);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例 1：</strong></p><pre><strong>输入：</strong>nums = [1,1,1,2,2,3]
<strong>输出：</strong>5, nums = [1,1,2,2,3]
<strong>解释：</strong>函数应返回新长度 length = <strong><code>5</code></strong>, 并且原数组的前五个元素被修改为 <strong><code>1, 1, 2, 2, 3</code></strong>。 不需要考虑数组中超出新长度后面的元素。
</pre><p><strong>示例 2：</strong></p><pre><strong>输入：</strong>nums = [0,0,1,1,1,1,2,3,3]
<strong>输出：</strong>7, nums = [0,0,1,1,2,3,3]
<strong>解释：</strong>函数应返回新长度 length = <strong><code>7</code></strong>, 并且原数组的前五个元素被修改为 <strong><code>0, 0, 1, 1, 2, 3, 3</code></strong>。不需要考虑数组中超出新长度后面的元素。
</pre><p><strong>提示：</strong></p><ul><li><code>1 &lt;= nums.length &lt;= 3 * 10&lt;sup&gt;4&lt;/sup&gt;</code></li><li><code>-10&lt;sup&gt;4&lt;/sup&gt; &lt;= nums[i] &lt;= 10&lt;sup&gt;4&lt;/sup&gt;</code></li><li><code>nums</code> 已按升序排列</li></ul>`,11);function b(f,E){const t=s("ExternalLinkIcon");return l(),i("div",null,[n("p",null,[e("这道题来自"),n("a",a,[e("力扣80题"),r(t)]),e("，这道题其实做完"),n("a",p,[e("力扣26题"),r(t)]),e("后并不难，就是一个双指针问题，但是如果从头开始看，可能觉得稍微困难。")]),u,n("p",null,[e("给你一个有序数组 "),g,e(" ，请你**"),n("a",m,[e(" 原地"),r(t)]),e("** 删除重复出现的元素，使得出现次数超过两次的元素"),_,e(" ，返回删除后数组的新长度。")]),n("p",null,[e("不要使用额外的数组空间，你必须在 **"),n("a",v,[e("原地 "),r(t)]),e("修改输入数组 **并在使用 O(1) 额外空间的条件下完成。")]),h])}const B=o(c,[["render",b],["__file","80.html.vue"]]);export{B as default};
