<template><div><h1 id="llama-2-论文笔记" tabindex="-1"><a class="header-anchor" href="#llama-2-论文笔记" aria-hidden="true">#</a> LLaMA 2 论文笔记</h1>
<p>该论文篇幅巨大，非常详细地介绍了LLaMA 2的预训练和微调过程，值得记录</p>
<hr>
<p>llama 2 特性1：采用了grouped-query attention方法 p.4</p>
<h2 id="_2-预训练方法" tabindex="-1"><a class="header-anchor" href="#_2-预训练方法" aria-hidden="true">#</a> 2 预训练方法</h2>
<ul>
<li>llama的训练方法：arXiv:2302.13971, 2023.</li>
<li>优化的自回归Transformer p.5</li>
<li>具体而言，我们执行了更稳健的数据清理，更新了我们的数据混合，对总token进行了40%以上的训练，将上下文长度增加了一倍，并使用分组查询注意力（GQA）来提高我们大型模型的推理可扩展性</li>
</ul>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1689901807800.png" alt="1689901807800" title="训练数据，注意LR"></p>
<p>2T = 2 trillion 2万亿</p>
<h3 id="_2-2-训练详情" tabindex="-1"><a class="header-anchor" href="#_2-2-训练详情" aria-hidden="true">#</a> 2.2 训练详情</h3>
<p>预训练的设置和模型架构和llama 1差不多</p>
<ul>
<li>Transformer架构</li>
<li>归一化 RMSNorm</li>
<li>激活函数 SwiGLU</li>
<li>旋转位置Embedding RoPE rotary positional embeddings，这个现在都在用，包括GLM</li>
<li>与llama 1差异：增加了上下文长度、增加了GQA</li>
</ul>
<h4 id="a-2-1-额外的预训练信息之与llama-1的变化内容介绍-p-46" tabindex="-1"><a class="header-anchor" href="#a-2-1-额外的预训练信息之与llama-1的变化内容介绍-p-46" aria-hidden="true">#</a> A.2.1 额外的预训练信息之与llama 1的变化内容介绍 p.46</h4>
<ol>
<li>上下文长度
更长的上下文长度可以让模型处理更多信息，这可以让模型支持记住更多对话历史信息、更多的总结任务、理解更长的文本</li>
<li>Grouped-Query Attention
自回归解码的标准做法是缓存序列中先前token的key（K）和value（V）对，从而加快注意力计算。然而，随着context window或batch size的增加，与多头注意力（MHA）模型中的KV缓存大小相关的<strong>内存成本</strong>显著增长。对于KV缓存大小成为瓶颈的大型模型，<strong>可以在多个头之间共享key和value预测</strong>，而不会导致性能大幅下降。可以使用具有单个KV投影的原始多查询格式(MQA)或具有8KV投影的分组查询注意力(GQA)变体。基于消融结果和易于缩放推断，对于34B和70B Llama 2模型，我们选择使用GQA而不是MQA。</li>
<li>额外发现：一个多卡并行训练的论文：Training multi-billion parameter language models using model parallelism</li>
</ol>
<h4 id="_2-2-0-超参设置" tabindex="-1"><a class="header-anchor" href="#_2-2-0-超参设置" aria-hidden="true">#</a> 2.2.0 超参设置</h4>
<ul>
<li>AdamW优化器 β1=0.9，β2=0.95，eps=10e-5</li>
<li>余弦学习率，warmup 2000 steps</li>
<li>将最终学习率降低到峰值学习率的10%</li>
<li>使用0.1的权重衰减和1.0的梯度剪裁</li>
</ul>
<h4 id="_2-2-0-tokenizer" tabindex="-1"><a class="header-anchor" href="#_2-2-0-tokenizer" aria-hidden="true">#</a> 2.2.0 Tokenizer</h4>
<p>使用与Llama 1相同的标记器；它采用了字节对编码（BPE）算法，使用了来自SentencePiece的实现。与Llama 1一样，将所有数字拆分为单个数字，并使用字节分解未知的UTF-8字符。总词汇大小为32k个标记。</p>
<h3 id="_2-3-评测" tabindex="-1"><a class="header-anchor" href="#_2-3-评测" aria-hidden="true">#</a> 2.3 评测</h3>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1689906367237.png" alt="1689906367237"></p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1689906551035.png" alt="1689906551035"></p>
<h2 id="_3-fine-tuning" tabindex="-1"><a class="header-anchor" href="#_3-fine-tuning" aria-hidden="true">#</a> 3. Fine-tuning</h2>
<p>LLaMA 2-Chat就是基于LLaMA 2微调而来，包括指令微调和RLHF</p>
<p>本节报告了使用监督微调以及初始和迭代奖励建模和RLHF进行的实验和发现。</p>
<p>提出一种新技术，Ghost Attention (GAtt)，用于帮助控制多轮对话流</p>
<h3 id="_3-1-supervised-fine-tuning-sft" tabindex="-1"><a class="header-anchor" href="#_3-1-supervised-fine-tuning-sft" aria-hidden="true">#</a> 3.1 Supervised Fine-Tuning (SFT)</h3>
<p>开始：用公开可获得的指令微调数据，像LLaMA 1那样使用	arXiv:2210.11416, 2022.</p>
<p>公开的指令微调数据质量参差不齐，首先就是要收集大量的高质量SFT数据，如下图：</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1689907443725.png" alt="1689907443725"></p>
<p>高质量指令微调数据，即使是少量的，也可以让结果很好。万级别的好的数据足够了，总共收集了27540个好数据。</p>
<ul>
<li>对于监督微调，使用了余弦学习率，LR=2e-5，权重衰减=0.1，batch size = 64，sequence lenght = 4096</li>
<li>对于微调过程，每个样本都包含一个提示和一个答案。为了确保模型序列长度正确填充，<strong>我们将训练集中的所有提示和答案连接起来</strong>。使用一个特殊的令牌来分隔提示段和应答段。我们使用自回归目标，并从用户提示中消除令牌的损失，因此，我们只对回答令牌进行反向传播。最后，我们对模型进行了2个epochs的微调。</li>
</ul>
<h3 id="_3-2-rlhf" tabindex="-1"><a class="header-anchor" href="#_3-2-rlhf" aria-hidden="true">#</a> 3.2 RLHF</h3>
<h4 id="_3-2-1-人类偏好数据收集" tabindex="-1"><a class="header-anchor" href="#_3-2-1-人类偏好数据收集" aria-hidden="true">#</a> 3.2.1 人类偏好数据收集</h4>
<p>与其他方案相比，我们选择了二进制比较协议，主要是因为它使我们能够最大限度地提高收集到的提示的多样性。我们的注释过程如下。我们要求注释器首先编写一个提示，然后根据提供的标准在两个采样的模型响应之间进行选择。为了最大限度地提高多样性，从两个不同的模型变量中对给定提示的两个响应进行采样，并改变温度超参数。除了给参与者一个被迫的选择之外，我们还要求注释者标注他们更喜欢自己选择的回答而不是选择的程度：要么他们的选择明显更好，要么更好，要么稍微好一点，要么好到可以忽略不计/不确定。</p>
<p>（就是给个输入，然后有两种输出，看哪个更符合标准）</p>
<ul>
<li>
<p>用到的一些人类偏好开源数据集</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690115105928.png" alt="1690115105928"></p>
</li>
</ul>
<h4 id="_3-2-2-奖励建模" tabindex="-1"><a class="header-anchor" href="#_3-2-2-奖励建模" aria-hidden="true">#</a> 3.2.2 奖励建模</h4>
<p>奖励建模就是拿一个模型的结果和它相关的Prompt作为输入，然后输出一个分数来表明这个结果的质量（有用性、安全性等），用这个分数，就可以在RLHF中优化模型了</p>
<p><strong>为了训练奖励模型</strong>，llama 2将收集的成对人类偏好数据转换为二元排名标签格式（即选择和拒绝），并强制选择的响应比对应的响应具有更高的分数。llama 2使用了二元排名损失：</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690116093348.png" alt="1690116093348"></p>
<p>where rθ(x, y) is the scalar score output for prompt x and completion y with model weights θ. yc is the preferred response that annotators choose and yr is the rejected counterpart.</p>
<p>在这种二元排名损失的基础上，llama 2进一步修改它，如第3.2.1节所示，利用这些信息来明确教导奖励模型为具有更多差异的世代分配更多不一致的分数可能是有用的。为此，llama 2在损失中进一步添加了一个margin成分：</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690116380614.png" alt="1690116380614"></p>
<p>where the margin m(r) is a discrete function of the preference rating. Naturally, we use a large margin for pairs with distinct responses, and a smaller one for those with similar responses (shown in Table 27). We found this margin component can improve Helpfulness reward model accuracy especially on samples where two responses are more separable. More detailed ablation and analysis can be found in Table 28 in Appendix A.3.3.</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690116520536.png" alt="1690116520536"></p>
<p><strong>奖励建模的训练详情</strong>。llama 2-chat在训练数据上训练一个epoch。在早期的实验中，<strong>发现训练时间过长会导致过度拟合</strong>。llama 2-chat使用与基本模型相同的优化器参数。70B参数Llama 2-Chat的最大学习率为5×10−6，其余参数为1×10−5。学习率按余弦学习率计划降低，降至最大学习率的10%。
llama 2-chat使用占总步数3%的warm-up，最少5 steps。有效batch大小固定为512对，即每batch 1024行。</p>
<p><strong>奖励建模的结果</strong>。在每一batch用于奖励建模的人类偏好注释上，<strong>都拿出1000个例子作为测试集来评估模型(这个都是可以学习的地方，按他的来)</strong>。我们将相应测试集的所有提示的并集分别称为“Meta Helpfulness”和“Meta Safety”。总体而言，我们的奖励模型优于所有base-line，包括GPT-4。</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690117393292.png" alt="1690117393292"></p>
<p>当我们在表8中按偏好评级对分数进行分组时，我们可以看到“明显更好”的测试集，并随着比较对变得更加相似而逐渐退化（例如，“稍微好一点”）。当在两个相似的模型反应之间做出决定时，由于注释者的主观性和他们对可能区分反应的细微细节的依赖，学习对人类偏好进行建模将变得具有挑战性。我们强调，对于提高Llama 2-Chat的性能，更明显的响应的准确性最为重要。与相似对相比，在更明显的反应上，人类偏好注释一致率也更高。</p>
<p><img src="@source/LLM/image/LLaMA2论文笔记/1690117652948.png" alt="1690117652948"></p>
</div></template>


