# footnotes (脚注)

## 概要
※、注などをもちいてコンテンツ内の補足を行う場合、文書構造上もコンテンツ内の注記マークと補足テキストの関係性を示すことが望ましい。
wai-ariaとリンク要素を使用し適切な注記コンポーネントを作成する

- wc.html
- foot-notes.js
- foot-notes.cssを参照
## 要求
1. HTML構造:
article タグ内に本文と脚注の参照を含める。
footer タグで脚注を定義し、ol タグで脚注のリストを作成する。
2. CSSカウンターの使用:
脚注参照には aria-describedby="footnote-label" 属性を使用し、CSSカウンターで番号を自動的に割り当てる。
footer 内の ol タグでカウンターをリセットし、リストアイテムに番号を表示する。
3. アクセシビリティ:
脚注リンクには aria-label="コンテンツへ戻る" を使用して、脚注から本文へのリンクを提供する。
脚注の見出しは .visually-hidden クラスを使用して視覚的に隠すが、スクリーンリーダーではアクセス可能。
1. スタイリング:
脚注番号は上付き文字で表示し、フォントサイズを小さくするなどして本文と区別する。
脚注番号には下線と青色のテキストを使用し、クリック可能であることを示す。


## 仕様（AI初期プロンプト）
```html
<section> <!-- <article>の可能性もある  -->
    <h2>タイトル</h2>
    <p>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記１つ目">注記が必要な単語ひとつめ</foot-note>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記２つ目">注記が必要な単語ふたつめ</foot-note>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記3つ目">注記が必要な単語みっつめ</foot-note>
    </p>
</section>
```
とした場合に以下のようなマークアップに展開されるwebcomponent

```html
<section> <!-- <article>の可能性もある  -->
    <h2>タイトル</h2>
    <p>
        <a href="#footnotes-1-1" aria-describedby="footnote-label-1" id="footnotes-ref-1-1">注記が必要な単語ひとつめ</a>
        <a href="#footnotes-1-2" aria-describedby="footnote-label-1" id="footnotes-ref-1-2">注記が必要な単語ふたつめ</a>
        <a href="#footnotes-1-3" aria-describedby="footnote-label-1" id="footnotes-ref-1-3">注記が必要な単語みっつめ</a>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記１つ目"></foot-note>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記２つ目">注記が必要な単語ふたつめ</foot-note>
        テキストテキストテキスト<foot-note description="詳細な注記詳細な注記詳細な注記詳細な注記3つ目">注記が必要な単語みっつめ</foot-note>
    </p>
    <footer>
        <h3 class="visually-hidden" id="footnote-label-1">注釈</h3>
        <ol>
            <li>
                詳細な注記詳細な注記詳細な注記詳細な注記１つ目<a href="#footnotes-ref-1-1" aria-label="Back to content">↩</a>
            </li>
            <li>
                詳細な注記詳細な注記詳細な注記詳細な注記2つ目<a href="#footnotes-ref-1-2" aria-label="Back to content">↩</a>
            </li>
            <li>
                詳細な注記詳細な注記詳細な注記詳細な注記3つ目<a href="#footnotes-ref-1-3" aria-label="Back to content">↩</a>
            </li>
        </footer>
</section>
```

footer内のheadingレベルはsection内のheadingレベルから一つ下げたものになるように

## V2
上記はプログレッシブ・エンハンスメントの観点からNGかもしれない。jsの読み込みを拒否しているブラウザ設定では注記自体が表示されない。

v2ではstaticな状態を以下とする


```html
<!-- without js -->
<section|article>
    <h2>title</h2>
    <p>some text<sup data-footnote>※1</sup>another text<sup data-footnote>※2</sup>....</p>
    <ol data-footnote-list>
        <li>footnote description1</li>
        <li>footnote description2</li>
    </ol>
</section|article>

<!-- in js -->
<section|article>
    <h2>title</h2>
    <p>some text<a 
    id="footnote-ref-{hash}-1" 
    href="#footnote-item-{hash}-1" 
    aria-describedby="footnote-{hash}-1"
    ><sup data-footnote>※1</sup></a>another text
    <a 
    id="footnote-ref-{hash}-2" 
    href="#footnote-item-{hash}-2" 
    aria-describedby="footnote-{hash}-2"
    ><sup data-footnote>※2</sup></a>....</p>
    <ol data-footnote-list id="footnote-{hash}" aria-label="注釈">
        <li id="footnote-item-{hash}-1">footnote description1<a href="#footnote-ref-{hash}-1" aria-label="Back to content">↩</a></li>
        <li id="footnote-item-{hash}-2">footnote description2<a href="#footnote-ref-{hash}-2" aria-label="Back to content">↩</a></li>
    </ol>
</section|article>
```