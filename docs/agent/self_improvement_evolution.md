---
title: 从 Context 到 Optimizer：Agent 自我改进的进化之路
date: 2026-09-13
category:
  - LLM
  - Agent
tag:
  - Agent
  - Self-Improvement
  - Harness
  - ACE
  - MCE
  - Meta-Harness
  - Self-Harness
  - STOP
  - DGM-H
---

# 从 Context 到 Optimizer：Agent 自我改进的进化之路

> 来源启发：https://lilianweng.github.io/posts/2026-07-04-harness/  
> 抖音原文：https://v.douyin.com/EHjFcWQ9ZiI

## 引言

在 AI Agent 的研究领域中，一个关键问题始终牵动着研究者的思考：当 Agent 遇到问题时，它能否不仅修复当前的错误，还能改进自己解决问题的能力？这正是 Agent 自我改进研究的核心命题。

本文将深入探讨 Harness 层面的自我改进技术演进——从最基础的 Context 优化，到 Harness Code 的动态修改，再到 Optimizer 本身的递归式改进。这是一条从表层调整走向深层重构的技术路线,每一步都在挑战"谁来改进改进者"这个根本性问题。

## 1. Context 层的自我改进：从规则累积到结构化管理

### ACE：给 Agent 一本可编辑的工作手册

想象你正在指导一个新员工，最开始你会给他一份工作手册。当他犯了错误，传统做法是在手册末尾追加一条新规则。几个月后，这份手册变得臃肿不堪，新规则和旧规则互相矛盾，没人能说清楚哪条规则更重要。

ACE (Agent Context Engineering) 提出的方案是：将 Agent 的指导规则组织成一个结构化的"工作手册"，每条规则都有唯一的 ID。当发现问题时，系统可以精确定位并更新特定规则，而不是无限制地追加内容。

#### ACE 的三个核心模块

ACE 框架由三个紧密协作的模块组成，形成一个完整的学习循环：

**1. Generator（生成器）**
- **职责**：执行实际任务，生成解决方案
- **工作方式**：根据当前的 Context Playbook（上下文手册）中的规则和策略来完成用户任务
- **输出**：任务执行轨迹（包括推理步骤、工具调用、中间结果等）

**2. Reflector（反思器）**
- **职责**：分析 Generator 的执行轨迹，提取经验教训
- **工作方式**：对比成功和失败的执行轨迹，通过自然语言评估和反思，识别出"什么有效、什么无效、为什么无效"
- **关键机制**：为每条提取的见解打上标签（Helpful/有用、Harmful/有害、Neutral/中性），这些标签会指导 Curator 的决策
- **输出**：结构化的见解（insights），包含具体的、领域特定的策略建议

**3. Curator（策展器）**
- **职责**：维护和演进 Context Playbook
- **工作方式**：
  - 接收 Reflector 提取的见解
  - 决定如何更新 Playbook：新增规则、修改现有规则、删除过时规则或合并重复规则
  - 使用**语义去重机制**避免重复内容
  - 使用 **helpful/harmful 计数**来评估每条规则的长期价值
- **输出**：更新后的 Context Playbook，以结构化的 bullet-point 格式组织

#### ACE 的工作流程示例

举个具体的例子。假设 Agent 在调用 API 创建资源后，直接返回了创建请求的响应，但没有验证资源是否真的创建成功。系统发现这个问题后，可以这样更新规则：

```yaml
operation: update
target_id: tool-017
new_content: 调用创建或更新接口后，应重新查询对象，并核对关键字段是否符合预期。
```

能看到这里面还有一个信息：每个规则都有 ID。ACE 只允许 Curator 对工作手册做局部更新，不能进行整体的重写，这是为了对抗上下文压缩时的不确定性——模型整体重写时可能会把一些规则的触发条件和失败模式压缩、导致丢失现场证据、决策依据等关键信息，论文里称之为 Context Collapse（上下文塌缩）。

这个很重要，总结是上下文压缩的手段之一，但不是做治理的手段。

#### Context Playbook 的内存管理策略

ACE 采用 **"grow-and-refine"** 策略来管理不断增长的上下文：

1. **增长阶段**：持续从失败案例中学习，添加新规则
2. **去重阶段**：定期检查语义相似的规则，合并重复内容
3. **剪枝阶段**：当 Playbook 接近最大长度限制时，根据 helpful/harmful 计数移除价值较低的规则
4. **版本控制**：每次更新都会保存版本快照，支持回滚到之前的状态

这种策略让 ACE 能够在有限的上下文窗口内持续学习，避免陷入"只能添加、不能删除"的困境。

#### 为什么要分离诊断和修改？

在传统的反思式改进中，Agent 通常一次性完成"我失败了，所以我要新增规则 X"的过程。但这种方式经常导致两个问题：要么没有找到真正的失败原因，只是针对表面现象打补丁；要么规则写得过于具体，缺乏泛化能力。

ACE 通过模块分工解决这个问题：
- **Reflector** 专注于因果分析，找到失败的根本原因（而非表面症状）
- **Curator** 专注于知识管理，决定如何最优地组织和更新 Playbook

这种分工让每个模块可以专注于自己擅长的事情，提高了规则质量。更重要的是，Curator 可以综合考虑多个轨迹中提取的见解，做出更加全局性的决策。

然而，ACE 的局限性也很明显：

1. **诊断的准确性问题**：Reflector 能否真正找到失败的根本原因？在复杂的执行轨迹中，因果关系往往不是线性的，表面上的失败点可能只是深层问题的症状。

2. **上下文膨胀问题依然存在**：论文提出的方案是 "grow-and-refine"——持续增加规则，定期去重，达到最大长度后剪枝。但这本质上还是"不断膨胀的上下文"，只是相对更可控。

3. **最关键的是**：ACE 只改上下文内容，不改学习和改进机制本身。比如它无法自己发现：
   - 语义去重机制的参数设置不合理
   - helpful/harmful 计数机制过于粗糙
   - Reflector 应该换一种归因方式
   - Curator 的更新策略需要调整

这些"元层面"的问题都是人类预设的，ACE 无法触及。因此，**ACE 是 Context 层的弱自我改进**，还不是对自我改进机制本身的递归优化。

### MCE：让 Agent 学会改进"如何改进"

MCE (Meta Context Engineering) 正是为了突破 ACE 的这个瓶颈而提出的。它的核心思想是：不仅要改进 Context，还要改进"改进 Context 的方法"。

整个系统分为两层：

**Base Level（基础层）**：Base Level 提供给任务 Agent 了一个东西叫：Context Function。这其实就是那些动态的上下文组装机制——Context Engineering 做的事情，根据用户输入 user prompt，系统通过若干处理步骤，从已有资料中（各种规则、失败案例、业务知识等）动态拼接一些 system prompt，最终真正提供给模型的上下文是 user prompt + system prompt。如果你了解过 Claude Code、OpenClaw 这类系统的上下文原理，会发现它们用的就是类似的机制。

**Meta Level（元层）**：这一层有一个 Context Engineering Skill（简称 CE Skill），它的作用是**制定改进方案**。它不直接修改 Context，而是观察 Base Level 在训练集上的表现，分析哪些地方需要改进，然后告诉 Base Level 的 Agent："你应该这样调整 Context Function"。

#### MCE 的工作示例

CE Skill 本身也就是改进者，比如这个 [SKILL.md] 可能长这样（注意下面只是极简示例）：

1. 批量分析全部失败案例，不要逐条追加规则。
2. 先判断错误来自知识缺失、检查失败还是推理流程错误。
3. 将具体案例存入 examples/；
4. 将通用原则存入 rules/；
5. 只有在至少三个样本中重复出现的模式才能进入正式 Context。
6. 修改后必须在验证集运行回归测试。
7. 如果验证分数下降，恢复上一版 Context。

我们不引入任何公式，直接找个具体的例子，比如：现在有个任务是让 Agent 对相册里的照片进行分类。这里我们选择了一个分类问题而不是开放问题作为例子，是为了降低一些复杂度。比如照片的类型有：人物、宠物、美食、风景、截图、票据、证件、其他。

先做一些准备工作——构建一个人工标注过的数据集，train/test 的划分和传统的机器学习、深度学习任务一样。

```
photos/
├── train/      500张，用于发现错误和学习上下文
└── test/       200张，用于最终优化效果评估
```

任务 Agent 也就是那个分类 Agent，它最开始得到的是：

- **user prompt**：照片
- **system prompt**：你是一个极具辨别能力的照片分类师，请将照片分类为：人物、宠物、美食、风景、截图、票据、证件、其他。

然后我们需要有一个评价器，评价的方式就用最简单的准确率。

这里用分类问题也是因为评价器的工作相对容易和明确，如果是开放问题，则涉及到 LLM Judge 和 Evals——这无疑是今天 Agent 自改进中最为关键的能力，但在这篇自改进路线的文章中我们不作为重点展开，关于评测我会写一篇单独的一文搞懂系列。

于是，任务 Agent 在训练集上执行了一轮任务，发现准确率是 68%。主要错误：证件经常被识别为票据、带人物的风景照经常被识别成人物、食物包装被识别成美食等等。

Meta Agent（图中 Meta Level）则负责产生一个初版的 CE Skill V1，由于还没有任何经验和错误沉淀，这个 CE Skill V1 非常简单：

```markdown
## 相册分类 Context Engineering Skill

1. 分析全部分类错误。
2. 按真实类别归组。
3. 为每个类别总结视觉特征。
4. 为每种常见混淆总结区分规则。
5. 为每个类别保存若干典型案例。
6. 生成一份分类指导手册。
```

注意，这份 Meta Skill 的作用并不是给出"票据通常包含金额和商户名称"这种具体的规则，它的任务是教给 Base Agent **如何从错误案例中提炼类别特征和规则**。

然后 Base Agent（图中 Base Level）结合这个 CE Skill V1，对着错误案例、真实结果还有当前上下文进行分析，补了一些具体的 .md 文件或者规则，比如一个片段是：

```markdown
## 票据 vs 证件

包含金额、交易日期、商户信息时，优先判断为票据。

包含人像、姓名时，优先判断为证件。
```

任务 Agent 拿着这个重新在训练集和测试集运行，发现训练集准确率从 68% → 88%，测试集 67% → 76%。有帮助，但也出现一些新的问题。于是，Meta Agent 结合这些观察再修改 CE Skill → Base Agent 执行，优化 Context → 任务 Agent 拿着 Context 执行，评估效果。如此循环，最终保留在测试集上表现更好的那个方案。

这个过程中，Meta Agent 会综合历史每一次改进的结果进行分析和组合，它可能发现：v2 过度保存训练样本细节，导致过拟合；v3 的错误聚类和验证后写入机制更有效；v1 的示例检索方式值得保留。于是它把成功方法组合成 skill-v4，论文称这个过程为 Crossover。

```
skill-v1 → context-v1 → train 0.91 → val 0.83
skill-v2 → context-v2 → train 0.96 → val 0.76
skill-v3 → context-v3 → train 0.90 → val 0.87
```

Context Function 的调整并不局限于新增/修改规则，Meta Agent 会分析究竟是缺少规则，还是注入了太多无关规则，也可能是规则的组织和检索方式不合理，然后提出对应的解决方案。

看完这些你再回去看最前面那张复杂的图，相信肯定能看懂了。这无疑比 ACE 更接近递归自我改进，但很遗憾它仍然不是。**因为它优化的是 CE Skill 而不是 Meta Optimizer / Meta Agent 本身**，比如怎么做改进评测、怎么做更有效的 Crossover、Meta Agent 的工具权限等等，它们并没有纳入改进的范畴。

但 MCE 仍然有一个边界：它改进的是 Context Engineering 的策略，但并没有改动生成和管理 Context 的代码本身。要突破这个边界，我们需要进入下一个层次。

## 2. Harness Code 层的自我改进：从修改配置到重写代码

从 Context 层往上，我们来到了 Harness Code 层。这一层不仅要改上下文的内容，还要改生成和管理这些上下文的代码本身。

### Meta-Harness：让 Coding Agent 重写 Harness

Meta-Harness 的核心思路是：既然模型已经能写代码了，为什么不让它直接修改 Harness 的代码？

#### Meta-Harness 的核心组件

**1. Proposer（提案生成器）**

系统引入了一个关键角色：**Proposer**——一个专门负责改进 Harness 的 Coding Agent。

Proposer 的工作流程是这样的：

1. **自主探索历史**：Proposer 不是被动接收信息，而是主动在文件系统中搜索。它会查看：
   - 不同版本 Harness 之间的代码差异（通过 git diff 或文件对比）
   - 失败案例的执行轨迹（保存在 logs/ 目录）
   - 之前的修改尝试及其效果（记录在 history/ 目录）
   - 当前 Harness 的完整源代码

2. **定位问题原因**：通过分析失败模式，Proposer 尝试找到 Harness 代码中的问题所在。例如：
   - System prompt 是否给出了误导性指令？
   - Tool 的使用策略是否合理？
   - Error recovery 机制是否完善？

3. **生成新版本**：基于分析结果，Proposer 写出一个新的完整 Harness。

论文中最复杂的实验里，Proposer 每轮会读取 82 个文件，并参考 20 多个历史候选 Harness。这个搜索和分析的过程完全是自主的，没有人工指定"看哪些文件"。

**2. Evaluator（评估器）**

当然，光有 Proposer 还不够，还需要一个独立的评价器来验证效果。Meta-Harness 的评估机制有以下特点：

- **多目标优化**：不仅看成功率，还要考虑效率（API 调用次数、执行时间等）
- **Pareto frontier**：使用帕累托前沿来平衡多个目标，避免为了提升一个指标而牺牲其他指标
- **Held-out 测试集**：用 Proposer 从未见过的测试用例来评估，防止过拟合

**3. 候选池管理**

Meta-Harness 维护一个候选 Harness 池，每个候选都有自己的性能档案。系统会：
- 保留帕累托最优的候选（在某个维度上最好，且在其他维度上不差）
- 淘汰被严格支配的候选（在所有维度上都不如其他某个候选）
- 允许人类从候选池中选择最适合自己需求的版本

Meta-Harness 实现了一个重要的跨越：**从修改数据到修改代码**。但它仍然依赖人类设计的外层循环——Proposer 怎么搜索、怎么评价、怎么选择，这些机制还是固定的。

### Self-Harness：闭环式的自我诊断与修复

Self-Harness 更进一步，它设计了一个完整的三阶段工作流程，让 Agent 能够系统性地发现问题、提出方案、验证效果。

**Self-Harness 的核心创新**

与 Meta-Harness 的主要区别在于：
- **单一模型完成所有角色**：同一个固定的语言模型在不同阶段扮演不同角色（Analyzer、Proposer、Validator），而不需要多个专门训练的模型
- **结构化的问题发现**：通过 Failure Pattern 抽象，系统能够识别系统性问题而非零散的失败案例
- **受控的修改范围**：明确定义哪些部分可以修改（Harness Surface），哪些必须保持不变

#### 第一阶段：Weakness Mining 与 Failure Pattern 识别

这个阶段的目标是：从大量失败案例中，找出系统性的弱点。

**Failure Signature 的生成**

系统会为每个失败案例生成一个 **Failure Signature**，包含三个关键信息：
- **任务类型**：例如 "API integration"、"data transformation"、"multi-step reasoning"
- **失败时的行为模式**：例如 "在第3步调用了错误的工具"、"没有验证中间结果"
- **Verifier 给出的失败原因**：基于测试用例的具体错误信息

**Failure Clustering 聚类**

当多个失败案例的 Failure Signature 一致时，它们会被聚合成一个 **Failure Cluster**。聚类使用以下方法：
- 基于 embedding 的语义相似度
- 任务类型的匹配
- 失败步骤的相似性

每个 Cluster 输出一个结构化的 **Failure Pattern**，包括：
- **频率**：这个模式出现了多少次（权重信息）
- **代表性案例**：最典型的 2-3 个失败任务
- **共同症状**：所有案例共享的轨迹特征
- **Verifier 证据**：测试失败的具体证据
- **行为机制分析**：推测是 Harness 的哪个部分导致了这种失败
- **可修复性评估**：这个问题是否可能通过修改 Harness Surface 来解决

注意，Failure Pattern 只描述问题，不规定解决方案。这样做的好处是**让诊断和修改保持分离**，避免过早锁定在某个特定的修复方案上。

#### 第二阶段：Harness Proposal

Weakness Mining 完成后，同一个固定模型会切换到 **Proposer 角色**。它会看到一个"受限的 Proposal Context"，包括：

- **当前允许修改哪些 Harness Surface**（明确的白名单）
- **反复出现的 Failure Patterns**（按频率排序）
- **哪些成功行为必须保留**（通过 held-out 测试集验证的正确行为）
- **历史上已经尝试过哪些修改**（避免重复无效的尝试）

**为什么是"受限的"？**

Self-Harness 并不允许 Proposer 随意重写整个系统。它只能修改 **Harness Definition File** 里预先声明的表面（Surface），每次修改的原则是：**改动面积小、不引入无关部分**。

**一个 Proposal 必须清楚说明：**
- **目标**：针对哪个 Failure Pattern
- **修改位置**：修改哪个 Harness Surface
- **预期效果**：预期改变什么行为
- **风险评估**：可能引入什么回归风险

**允许修改的 Harness Surface**：
- **System Prompt**：Agent 的角色定义、任务理解、推理策略
- **Skills 定义**：可调用的技能、工具使用规范
- **Sub-agent 配置**：子任务分解策略、子 Agent 的职责定义
- **Failure Recovery Instruction**：遇到错误时的恢复策略
- **Runtime Control Policy**：执行流程的控制逻辑（例如重试次数、超时设置）

**不允许修改的部分**：
- **Evaluator 本身**：评估机制必须保持客观和稳定
- **Verifier 的逻辑**：测试验证器不能被 Agent 操纵
- **Held-out 测试数据**：测试集必须对 Proposer 保密
- **Self-Harness 外层循环**：改进流程本身的框架
- **底层 Agent SDK 核心代码**：基础设施层

**Proposal 生成的关键技术**

1. **差异化分析**：Proposer 会对比成功和失败案例的轨迹，找出关键差异
2. **最小化修改原则**：优先考虑局部修改，避免大范围重写
3. **可回溯性**：每个 Proposal 都包含明确的变更说明，支持版本回滚
4. **冲突检测**：检查新 Proposal 是否与已知的成功模式冲突

这种设计确保了系统的可控性——Agent 可以自主改进，但改进的范围是被约束的。

#### 第三阶段：Proposal Validation

修改后会形成一个新的候选 Harness，然后在两组任务上运行：

**Held-in 集合**：用于发现 Failure Pattern 的那些任务。这组任务用来验证：修改是否真的解决了观察到的问题？

**Held-out 集合**：从未提供给 Proposer 的任务。这组任务用来验证：修改是否破坏了其他没被观察到的能力？

**验证流程的具体步骤**：

1. **基线测试**：在两个测试集上运行当前版本的 Harness，记录性能指标
2. **候选测试**：在相同测试集上运行候选版本的 Harness
3. **性能对比**：计算成功率、平均步数、API 调用次数等多个维度的变化
4. **统计显著性检验**：确保观察到的改进不是随机波动

Evaluator 会比较当前版本和候选版本的表现。**只有同时满足以下条件，候选版本才会被采纳**：
- 在 Held-in 和 Held-out 上都没有退步（或退步在容忍范围内）
- 至少在其中一个上有统计显著的提升
- 没有引入新的严重错误类型

**Self-Harness 的一个关键限制**

这个逻辑看似合理，但有一个隐患：**它可能会拒绝那些短期退步、但长期收益更大的修改**。

例如，一个修改可能在某些简单任务上表现略差（因为增加了验证步骤），但在复杂任务上显著提升了鲁棒性。线性的接受/拒绝策略可能会错过这种权衡。

加上 Self-Harness 采用的是**线性改进模式**（每次只保留一个最优版本），系统很容易陷入局部最优。这个问题在后面的 DGM-H 中会得到解决。

**Self-Harness 的成就与局限**

Self-Harness 实现了一个完整的闭环：同一个固定模型，可以根据自己的失败轨迹，提出对自身 Harness 的修改，并通过外部回归测试决定是否采用。

但它的局限也很明显：

1. **高度依赖 Verifier 和 Evaluator 的质量**：如果评价标准本身有问题，整个改进循环就会偏离方向。

2. **改动范围受限**：Harness 的可改动区域是人为圈定的。如果真正的问题位于不可改动区域，Self-Harness 即使发现了问题，也无法修复。

3. **改进者本身没有被改进**：Self-Harness 更新的是 Proposal 的结果和上下文，但 Proposal 生成器本身的机制（比如 Proposal Context 的构建模板、必须包含哪些字段、调用多少个候选 K）在改进过程中并没有被修改。

距离强递归自我改进，还有最后一步要走。

## 3. Optimizer Code 层的自我改进：改进"改进者"本身

### STOP：Self-Taught Optimizer

在 Meta-Harness 和 Self-Harness 的基础上，我们终于来到了最核心的问题：**如何改进改进者本身**？

STOP (Self-Taught Optimizer) 提出了一个大胆的想法：让模型优化一个通用的 Improver（改进器），这个 Improver 的任务是改进任意给定的程序。

#### 如何评价一个 Improver 的好坏？

显然不能只看它改好某一个程序的能力，因为那可能只是碰巧。STOP 的做法是：准备一组下游任务，计算某个 Improver 在这些任务上的**平均表现**。

论文中称这个指标为 **Meta-Utility**——它衡量的是：一个 Improver 平均能把下游程序改到多好。

**Meta-Utility 的计算方法**：

1. **准备任务集合**：选择一组代表性的编程任务（例如 MBPP、HumanEval 等基准测试）
2. **初始解决方案**：为每个任务准备一个基线解决方案（可能是错误的或次优的）
3. **应用 Improver**：让 Improver 尝试改进每个初始解决方案
4. **评估改进效果**：使用任务特定的 utility 函数（通常是测试通过率）评分
5. **计算平均值**：Meta-Utility = 所有任务上改进后的平均得分

这种评估方式确保 Improver 的优化能力是**领域无关的**，而不是针对某个特定任务过拟合。

#### 从最简单的 Seed 开始

系统从一个极其简单的 Seed Improver 开始，比如一个朴素的 Best-of-N 搜索器：

```python
def improve_algorithm(initial_solution, utility, language_model):
    prompt = f"""
    请改进下面的程序:
    
    {initial_solution}
    
    你的结果将由这个函数评分:
    
    {utility}
    """
    
    candidates = language_model.generate(
        prompt,
        n=6,
        temperature=0.7
    )
    
    return max(candidates, key=utility)
```

这个 Improver 非常简单：看到代码 → 生成多个候选改进 → 逐个运行 → 返回得分最高的那个。

#### 模型自发探索出的优化算法

有趣的是，当 STOP 让模型优化这个 Improver 时，模型并非只是调整 prompt，而是自发地探索出了多种经典的优化算法：

**Beam Search**：不只保留一个候选，而是保留一组高分候选，避免过早锁死在一个方向上。

**Genetic Algorithm**：维护一个候选种群，对多个程序做 Mutation（变异）和 Crossover（交叉），生成新程序。

**分解优化**：把程序拆成多个函数，分别改进每个部分，再组合起来。一次生成一个在所有部分都正确的完整程序很难，但分别找到每个局部的改进方案要容易得多。

**Simulated Annealing**：动态调节探索程度。搜索早期用高 temperature，允许激进修改、扩大探索范围；搜索后期用低 temperature，围绕现有高分方案做保守修改。

这些都不是人类预先编程进去的，而是模型在优化 Improver 时自己发现的。

#### STOP 的意义与局限

STOP 证明了一个重要的原理：**模型外部的认知支架（Harness）并不是只能由人类设计，支架本身可以成为模型驱动优化的对象。**

但严格来说，STOP 仍然不算完整的 Harness 层强递归自我改进，因为它处理的 Harness 相比现实中的 Agent 系统要简化得多——没有文件系统记忆、没有 Subagent 管理、没有工具权限控制、没有长期状态维护。

它相当于在一个简易版的脚手架上实现了强递归自我改进。尽管如此，这已经是一个非常重要的原型，为后续研究指明了方向。

### DGM-H：达尔文式的进化探索

如果说 STOP 是在简化环境中验证了强递归自我改进的可能性，那么 DGM-H (Darwin Gödel Machine with Hyperagent) 就是在尝试构建一个更完整、更开放的自我改进系统。

#### 什么是 Hyperagent？

首先不要被这个名字唬住。Hyperagent 不是"超级智能体"，而是指：**同时包含 Task Agent（被改进对象）和 Meta Agent（改进者），并且两者都可以被修改的统一程序**。

**Hyperagent 的结构**：

```python
class Hyperagent:
    def __init__(self):
        self.task_agent = TaskAgent()      # 执行实际任务
        self.meta_agent = MetaAgent()      # 负责改进
        self.memory = Memory()             # 共享记忆系统
        self.evaluation_history = []       # 历史表现记录
    
    def execute_task(self, task):
        """执行任务"""
        return self.task_agent.run(task)
    
    def self_improve(self):
        """自我改进"""
        # Meta Agent 分析当前 Hyperagent 的弱点
        weaknesses = self.meta_agent.analyze(self)
        
        # 生成改进方案（可以修改 task_agent 或 meta_agent）
        proposal = self.meta_agent.propose_improvement(weaknesses)
        
        # 返回新的 Hyperagent 版本
        return proposal.apply(self)
```

它允许 Meta Agent 修改整个 Hyperagent，包括修改 Meta Agent 自己。论文中称之为**元认知自我修改**（Metacognitive self-modification）。

这与 Self-Harness 的关键区别在于：
- **Self-Harness**：改进者（改进逻辑）是固定的，只能修改被改进对象（Task Agent 的 Harness）
- **DGM-H**：改进者本身也可以被修改，实现了更深层次的递归

#### 为什么叫 Darwin Gödel Machine？

这个名字来自两个思想的结合：

**Gödel Machine**：描述的是能够进行递归式自我改进的机器——不仅改进任务执行能力，还改进自我改进的能力。

**Darwin（达尔文）**：引入了生物进化的思想——不再采用线性改进模式（每次只保留一个最优版本），而是维护一个 **Agent Archive**，保存多个不同版本，每个版本都可以成为未来演化的起点。

这种设计解决了 Self-Harness 的一个关键问题：**如何避免过早淘汰那些短期表现不佳、但长期可能带来突破的修改**？

在 Self-Harness 中，如果某个修改在 Held-in 或 Held-out 上表现退步，它会立即被拒绝。但在 DGM-H 中，这个"表现不佳"的版本会被保留在 Archive 中，未来它可能成为新的演化分支的起点。

#### 进化式的选择策略

每一轮改进中，系统需要从 Archive 中选择一个 parent Harness 进行修改。这个选择策略非常有意思，需要在"表现好"和"尚未充分探索"之间平衡：

**选择概率的计算公式**：

```
P(选择 agent_i) ∝ score(agent_i)^α / (1 + β * offspring_count(agent_i))
```

参数说明：
- **score(agent_i)**：该 Agent 在评估集上的得分
- **α**：控制对高分 Agent 的偏好程度（α 越大，越倾向选择高分者）
- **β**：控制对已充分探索的 Agent 的惩罚力度
- **offspring_count**：该 Agent 已经产生了多少个子代

**这个策略的巧妙之处**：

1. **奖励优秀表现**：评估分数更高的 parent，被选中的概率更大（通过 score^α 实现）
2. **惩罚过度探索**：如果某个 parent 已经产生了很多子代，它的选择概率会降低（通过除以 offspring_count 实现）
3. **保持多样性**：即使是分数较低的 Agent，仍有非零概率被选中（soft selection，而非 hard cutoff）

这能避免系统一直围绕当前得分最高的 Harness 做小修小补，而忽略了其他可能的探索方向。

**修改操作**：

修改完成后，`child = parent.modify(parent)`——parent 会尝试改进自己，生成一个新的版本 child。

修改操作可能包括：
- 调整 Task Agent 的 System Prompt
- 修改工具使用策略
- 改进 Meta Agent 的分析方法
- 调整记忆检索机制
- 优化子任务分解逻辑

#### DGM-H 的完整流程

核心要点是：

1. 从 Archive 中选择一个 parent
2. Parent 的 Meta Agent 分析自己的弱点
3. 生成改进方案，产生 child
4. 在测试集上评估 child
5. 将 child 加入 Archive（即使表现不够好，也保留）
6. 重复这个过程

#### 跨领域迁移：证明 Meta-Agent "学会了改进"

如何证明 Meta-Agent 真的"学会了如何改进"，而不只是记住了某些具体任务的解法？

论文做了一个巧妙的跨领域迁移实验：

- **训练阶段**：Task Agent 的任务是对学术论文进行评审（Peer Review）
- **测试阶段**：Task Agent 的任务是对奥数题的解题过程进行评分（Math Grading）

显然，刚开始 Task Agent 完全不会做奥数评分任务，得分接近 0。但如果 Meta-Agent 已经学会了"如何快速改良出一个有效的 Task Agent"，那么它应该能在新任务上也表现出这种能力。

**实验设计的关键点**：

1. **零样本迁移**：在奥数评分任务上，Meta-Agent 没有经过任何训练，直接应用在论文评审任务上学到的改进能力

2. **评估指标**：使用 **improvement@k** 来衡量——给 Meta-Agent 最多 k 次修改机会，它最多能把一个初始 Task Agent 提升多少分

3. **对照组设置**：
   - **Baseline**：从头开始训练的 Hyperagent（没有迁移学习）
   - **Fixed Meta-Agent**：使用训练阶段学到的 Meta-Agent，但不允许它继续改进自己
   - **Full DGM-H**：允许 Meta-Agent 在新任务上继续进化

**实验结果**：

- **Baseline**（从零开始）：50 次迭代后提升约 0.42
- **Fixed Meta-Agent**（迁移但不进化）：50 次迭代后提升约 0.55
- **Full DGM-H**（迁移且继续进化）：50 次迭代后提升约 0.63

这说明：
1. Meta-Agent 确实学到了一些**跨领域的改进策略**（Fixed 优于 Baseline）
2. 允许 Meta-Agent 继续自我改进能进一步提升效果（Full 优于 Fixed）
3. 改进能力具有一定的**可迁移性**，不是简单地记忆特定任务的解法

#### DGM-H 的成就与边界

在我看来，DGM-H 已经非常接近 Harness 层的强递归自我改进：

✓ 它能修改任务 Agent 的 Harness  
✓ 它也能修改负责改进的 Meta Agent  
✓ 它采用进化式的探索，避免局部最优  
✓ 它展示了一定的跨领域迁移能力

但论文本身也坦诚地指出，它还不能修改：
- Archive 的维护策略（什么时候清理旧版本）
- Parent 的选择算法（如何平衡利用与探索）
- 评分机制（如何评价一个 Harness 的好坏）
- 停止条件（什么时候结束改进循环）

以及整个外层的 DGM-H 循环本身。

这些"元元层"的机制仍然是人类设计的。要继续向上递归，理论上可以再套一层更高阶的 Meta Meta Agent，但这会带来新的问题：如何确保系统仍然可控？

## 思考与展望

从 ACE 到 DGM-H，我们见证了 Agent 自我改进技术的逐层演进：

**Context 层**（ACE、MCE）：改进的是给模型看的文本内容和规则。

**Harness Code 层**（Meta-Harness、Self-Harness）：改进的是生成和管理这些内容的代码本身。

**Optimizer 层**（STOP、DGM-H）：改进的是负责改进的机制本身——改进者也成为被改进的对象。

这条路线的每一步，都在向"强递归自我改进"靠近。但我们也必须清醒地认识到：

**100% 意义上的强递归自我改进并非我们的目标。**

一个没有任何边界、可以修改自己一切的系统，可能带来难以估量的风险。所以关键在于"受控"——我们需要给 Agent 设定清晰的边界，确保它在有限的空间内进行自我改进。

当前这些研究已经证明：
- 模型有能力改进自己的 Harness
- 甚至有能力改进"如何改进"的机制本身
- 这种能力在一定程度上可以跨领域迁移

但真正的挑战才刚刚开始：
- 如何设计更可靠的评价机制？
- 如何在开放探索和可控性之间取得平衡？
- 如何让 Agent 学会长期价值，而不是陷入短期优化？

这些问题的答案，将决定 Agent 自我改进技术能走多远。
