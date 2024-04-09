import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as d,c,b as n,d as e,e as s,a as l}from"./app-2bc3c870.js";const i={},u={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/?envType=study-plan-v2&envId=top-interview-150",target:"_blank",rel:"noopener noreferrer"},g=n("strong",null,"非严格递增排列",-1),a=n("code",null,"nums",-1),m={href:"http://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95",target:"_blank",rel:"noopener noreferrer"},p=n("strong",null,"只出现一次",-1),_=n("strong",null,"相对顺序",-1),v=n("strong",null,"一致",-1),h=n("code",null,"nums",-1),b=l(`<p>考虑 <code>nums</code> 的唯一元素的数量为 <code>k</code> ，你需要做以下事情确保你的题解可以被通过：</p><ul><li>更改数组 <code>nums</code> ，使 <code>nums</code> 的前 <code>k</code> 个元素包含唯一元素，并按照它们最初在 <code>nums</code> 中出现的顺序排列。<code>nums</code> 的其余元素与 <code>nums</code> 的大小不重要。</li><li>返回 <code>k</code> 。</li></ul><p><strong>判题标准:</strong></p><p>系统会用下面的代码来测试你的题解:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>int[] nums = [...]; // 输入数组
int[] expectedNums = [...]; // 长度正确的期望答案

int k = removeDuplicates(nums); // 调用

assert k == expectedNums.length;
for (int i = 0; i &lt; k; i++) {
    assert nums[i] == expectedNums[i];
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果所有断言都通过，那么您的题解将被 <strong>通过</strong> 。</p><p><strong>示例 1：</strong></p><pre><strong>输入：</strong>nums = [1,1,2]
<strong>输出：</strong>2, nums = [1,2,_]
<strong>解释：</strong>函数应该返回新的长度 <strong><code>2</code></strong> ，并且原数组 <em>nums </em>的前两个元素被修改为 <strong><code>1</code></strong>, <strong><code>2 </code></strong><code>。</code>不需要考虑数组中超出新长度后面的元素。
</pre><p><strong>示例 2：</strong></p><pre><strong>输入：</strong>nums = [0,0,1,1,1,2,2,3,3,4]
<strong>输出：</strong>5, nums = [0,1,2,3,4]
<strong>解释：</strong>函数应该返回新的长度 <strong><code>5</code></strong> ， 并且原数组 <em>nums </em>的前五个元素被修改为 <strong><code>0</code></strong>, <strong><code>1</code></strong>, <strong><code>2</code></strong>, <strong><code>3</code></strong>, <strong><code>4</code></strong> 。不需要考虑数组中超出新长度后面的元素。
</pre><p><strong>提示：</strong></p><ul><li><code>1 &lt;= nums.length &lt;= 3 * 10&lt;sup&gt;4&lt;/sup&gt;</code></li><li><code>-10&lt;sup&gt;4&lt;/sup&gt; &lt;= nums[i] &lt;= 10&lt;sup&gt;4&lt;/sup&gt;</code></li><li><code>nums</code> 已按 <strong>非严格递增</strong> 排列</li></ul>`,12);function f(k,x){const o=r("ExternalLinkIcon");return d(),c("div",null,[n("p",null,[e("该题来自"),n("a",u,[e("力扣26题"),s(o)]),e("，注意是双指针题就可以了。")]),n("p",null,[e("给你一个 "),g,e(" 的数组 "),a,e(" ，请你**"),n("a",m,[e(" 原地"),s(o)]),e("** 删除重复出现的元素，使每个元素 "),p,e(" ，返回删除后数组的新长度。元素的 "),_,e(" 应该保持 "),v,e(" 。然后返回 "),h,e(" 中唯一元素的个数。")]),b])}const B=t(i,[["render",f],["__file","26.html.vue"]]);export{B as default};
