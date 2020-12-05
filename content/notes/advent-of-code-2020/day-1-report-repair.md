# AoC 2020 Day 1 — Report Repair

<BoxedText>

Link to the exercise: https://adventofcode.com/2020/day/1

</BoxedText>

Okay, we gotta find 2 numbers in the array summing to 2020 and multiply
them. Easy.

We could do a brute force solution by looking at every pair and checking if
it sums to 2020.

```
for a in numbers
  for b in numbers
    if a + b == 2020
      return a * b
```

Asymptotic time complexity is _O(n<sup>2</sup>)_, because for every one of
`n` elements we iterate through all n of our elements, where `n` is the size
of our input array.

We can improve on it, but let's get the data first.

I'm pasting the input array into my code, because I don't care about text
parsing right now.

```u
puzzle1Data = [1287, 1366, 1669, 1724, 1338, 1560, 1328, 1886, 1514, 1863, 1876, 1732, 1544, 1547, 1622, 1891, 1453, 1936, 178, 1398, 1454, 1482, 1585, 1625, 1748, 1888, 1723, 717, 1301, 1840, 1930, 1314, 1458, 1952, 1520, 1994, 1924, 1873, 1283, 1036, 2005, 1987, 1973, 1926, 335, 1316, 1241, 1611, 1593, 1754, 1254, 1768, 1824, 1752, 1559, 1221, 1855, 1907, 1917, 1975, 1782, 1966, 1395, 1681, 1236, 1572, 437, 1294, 1614, 1549, 1769, 1963, 1953, 1708, 1382, 1920, 1884, 1841, 1055, 1799, 1818, 1902, 1541, 1830, 1817, 1939, 1311, 1157, 1997, 1269, 2000, 1573, 1898, 1467, 1929, 1530, 1336, 1599, 1860, 1455, 1944, 1339, 1341, 1874, 1322, 1340, 1583, 1765, 1776, 1304, 1880, 1237, 1770, 1011, 1634, 1343, 1864, 1648, 1588, 933, 1839, 1245, 780, 1671, 1989, 1416, 1268, 1619, 1399, 1638, 1319, 1565, 1318, 1084, 1397, 1645, 1760, 1487, 1892, 1980, 1928, 1808, 1692, 1159, 1531, 1575, 457, 1650, 1308, 1347, 1427, 1148, 1705, 1356, 1519, 1490, 1324, 1387, 1649, 1780, 1361, 1866, 1828, 1274, 1606, 1477, 1956, 734, 1483, 1513, 1215, 1927, 1988, 1686, 1914, 1424, 968, 1949, 1999, 1296, 1615, 1446, 1698, 1959, 1983, 2010, 1984, 1859, 1838, 1680, 1134, 1529, 1552, 1764, 1981, 1862, 1430, 1793, 1901, 1909]
```

Time for some Unison code. Let's go through our elements once, and for each
`a` look for `2020 - a`. This should give us _O(n \* lookup-time)_, where
lookup time is _O(log(n))_ for balanced binary trees and _amortized/expected
O(1)_ for hashmaps.

```u
findTwoSummingTo2020 : List Nat -> (Nat, Nat)
findTwoSummingTo2020 numbers =
  numbersSet = Set.fromList numbers
  go : List Nat -> (Nat, Nat)
  go = cases
    [] -> -- uhh? --
    head +: tail -> (0, 0) -- some implementation --
  go numbers
```

We take a list of natural numbers, and return a pair of natural numbers. I
forgot about handling the corner case, though. What if we don't find
anything? What if we get an empty list?

Unison has algebraic effects which he weirdly calls abilities, and there is
an effect called Abort in the standard library, so I could throw an
exception, but that whole algebraic effects schtick forces me to actually
handle it later :/

Using `Optional` will be easier, and probably more elegant here.

```u
findTwoSummingTo2020 : List Nat -> Optional (Nat, Nat)
findTwoSummingTo2020 numbers =
  numbersSet = Set.fromList numbers
  go : List Nat -> Optional (Nat, Nat)
  go = cases
    [] -> None
    head +: tail ->
      x = 2020 - head
      if Set.contains x numbersSet
        then Some (head, x)
        else go tail
  go numbers
```

Banging. I added that Optional and a conditional expression, and the code
starts looking proper.

This obviously doesn't work. It doesn't typecheck, because Unison doesn't
know what `-` means.

<figure>

```
I'm not sure what - means at line 16, columns 16-17

    16 |       x = 2020 - head

Whatever it is, it has a type that conforms to .base.Nat ->{𝕖} .base.Nat ->{𝕖} .base.Nat.
I found some terms in scope with matching names but different types.

If one of these is what you meant, try using the fully qualified name and I might
be able to give you a more illuminating error message:

  - .base.Float.- : .base.Float -> .base.Float -> .base.Float
  - .base.Int.- : .base.Int -> .base.Int -> .base.Int
  - .base.Nat.- : .base.Nat -> .base.Nat -> .base.Int
```

<figcaption>output from <code>ucm</code></figcaption>

</figure>

Really nice error message, my new friend.

Unison has at least three types for numbers

- `Int` — signed 64-bit integer
- `Nat` — unsigned 64-bit integer
- `Float` — 64-bit floating point

Which are WAY better names than `long long`, `unsigned long long` and
`double`. I didn't code in C for years, and I'm still salty. Still, I kinda
prefer Rust's `u64`, but I digress.

There's no implicit coercion in Unison, so my set of `Nat`ural numbers and
subtraction aren't the best friends (`Nat.-` returns `Int`). Let's turn it
all into signed integers. Figuring this out took me more than I want to
admit, but Unison wanted me to add a plus sign in front of every positive
number. Signed integers... oh...

```u
puzzle1Data = List.map Nat.toInt listOfNaturalNumbersFromBefore

findTwoSummingTo2020 : List Int -> Optional (Int, Int)
findTwoSummingTo2020 numbers =
  numbersSet = Set.fromList numbers
  go : List Int -> Optional (Int, Int)
  go = cases
    [] -> None
    head +: tail ->
      x = +2020 - head
      if Set.contains x numbersSet
        then Some (head, x)
        else go tail
  go numbers
```

This worked. Now what's left is only multiplying the two numbers I've found.
The code before was quite readable, so I'll make the next function
point-free 🤣

```u
solve : List Int -> Optional Int
solve = Optional.map (uncurry (Int.*)) . findTwoSummingTo2020
```

`>` starts watch expression which is conveniently printed by Unison Codebase
Manager on save.

```
> solve puzzle1Data
```

<figure>

![](https://user-images.githubusercontent.com/15332326/101247033-26d1ef00-3717-11eb-96ef-3ab47611a853.png)

<figcaption>output from <code>ucm</code></figcaption>

</figure>

Sweet. Advent's website confirmed my result, and gave me the second part of
the task. Before I get to it, I want to make my code more _unisony_.

It seems to me that Unison is one [[languages-for-engineering]]. Tests and
documentation are first-class citizens in the language.

Here's how I wrote the docs. You can read more about it at
https://www.unisonweb.org/docs/documentation.

```u
findTwoSummingTo2020.doc = [:
  `@findTwoSummingTo2020 numbers` finds two elements of numbers list
  summing to 2020.

  Here's a typical example:

  @[source] findTwoSummingTo2020.examples.ex1

  ⧩
  @[evaluate] findTwoSummingTo2020.examples.ex1

  `@findTwoSummingTo2020 []` is equal to None.

  Asymptotic time complexity is ϴ(nlogn) or amortized ϴ(n) depending on
  Unison's builtin Map implementation (balanced tree or hashmap).
:]
```

<figure>

![](https://user-images.githubusercontent.com/15332326/101245638-76f88380-370e-11eb-8af5-171d562a087e.png)

<figcaption>documentation for `findTwoSummingTo2020` rendered by `ucm`</figcaption>
</figure>

And these are my tests:

```u
test> findTwoSummingTo2020.tests.one =
  check (
    findTwoSummingTo2020 [+2000, +1995, +25, +1234] == Some (+1995, +25)
  )

test> solve1.tests.one = check (solve1 puzzle1Data == Some +691771)
```

<figure>

![](https://user-images.githubusercontent.com/15332326/101259254-0a8a7e00-3728-11eb-8f5c-4c5744b0989b.png)

</figure>

---

Okay, part two of the puzzle. Now we have to find three numbers summing
to 2020. I don't have any new, smarter idea, so I'll just build on top of my
existing solution.

```u
findTwoSummingToX : List Int -> Set Int -> Int -> Optional (Int, Int)
findTwoSummingToX numbers numbersSet sum =
  go : List Int -> Optional (Int, Int)
  go = cases
    [] -> None
    head +: tail ->
      x = sum - head
      if Set.contains x numbersSet
        then Some (head, x)
        else go tail
  go numbers

findThreeSummingToX : List Int -> Set Int -> Int -> Optional (Int, Int, Int)
findThreeSummingToX numbers numbersSet sum =
  findTwo = findTwoSummingToX numbers numbersSet
  cons = Optional.map . Tuple.Cons
  List.foldl (acc val ->
    let
      use Int -
      diff = sum - val
      if isSome acc then acc else (cons val (findTwo diff))
  ) None numbers

solve2 numbers =
  match findThreeSummingToX numbers (Set.fromList numbers) +2020 with
    Some (a, b, c) -> Some ((a, b, c), a * b * c)
    None -> None

> solve2 puzzleData
```

Here it is. I'm quite impressed with this language.

Did you, the human reading this, take part in the Advent of Code? Have you
tried any new language? Let me know!
