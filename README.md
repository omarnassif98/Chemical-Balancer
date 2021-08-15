# Chem1100 Final Project

## What is this?

The project hosted on this repository is a web-enabled chemical formula balancer. While this page shows a good view of the back-end. It is at it's most presentable when viewed from the perspective of a user, a chemistry student.
It can be accessed [online](https://chem-balancer.omarnassif.me/).

## Rationale

The claim to fame behind this project is its use of linear algebra in order to solve balancing questions. In order to understand just how this is done, one should adopt a somewhat different perspective on the matter.

In essence, these formulas can be thought of in as algebraic statements; a balanced formula must maintain the same variety and abundancy of elements before and after a reaction. The difficulty arises when it is noted that the composition of the compounds which form each statement is subject to change. 

Take NaCl (table salt) for instance, which is formed when the two reactants Na (sodium) and Cl<sub>2</sub> (chlorene gas) are exposed to one another. Even in a simple example like this, it is possible to see the advantages of an algebraic approach by simply making the following observations:

<code>Na + Cl<sub>2</sub> &#8594; NaCl</code>

- A unit of chlorine gas has two chlorine atoms, this is part of its identity and cannot be changed.
- A unit of sodium only has one sodium atom, this is part of its identity and cannot be changed.
- Table salt is composed of one part sodium atom and one part chlorine atom, this is part of its identity and cannot be changed.

When these observations are brought to the forefront, it becomes apparent that the amount of sodium and chlorine atoms should be equal to eachother in order for the reactants to be converted into sodium-chloride. The way that this happens is quite simple; it is not the chemical identities of neither the sodium nor chlorine gas that changes, rather it is the actual amount of units involved that change.

<code>**2**Na + Cl<sub>2</sub> &#8594; **2**NaCl</code>

Indeed, it takes two units of sodium for the amount of sodium atoms to equal the amount of chlorine atoms in one unit of chlorine gas. Furthermore, this leaves the amount of atoms in the reactants exactly double what is in the product. As such, this reaction creates two units of table salt.

This is an extremely simple example but the rationale remains true for more complex reactions.

## So... Where's the linear algebra?

As briefly mentioned before, it is highly beneficial to approach this topic from the domain of algebra. These problems are essentially linear combination problems. By representing each of the reactants and products as vectors, it becomes easier to perform operations on them. However, adopting this approach comes with its own considerations, they are as follows.

- Since only vectors of the same length can be added and subtracted from one another, a vector must keep track of the prevalence of all elements relevant to the formula in a compound, including elements not found in the compound.
- All vectors must subscribe to the same representational order of elements within their indices.

Continuing from the example in the above section, the formula for table salt can also be described as such:

```
Assuming the order of elemental representation in vectors is [# of sodium atoms, # of chlorine atoms]
a[1,0] + b[0,2] = c[1,1]
a[1,0] + b[0,2] = c[a,2b]
```

At this point, it is possible to use a calculator to solve this as a system of linear equations. This project used the python library [sympy](https://www.sympy.org/en/index.html) to do so.

## Takeaway

This project proved extremely fruitful. Beyond allowing for a more nuanced look at a chemistry concept. It presents a very real use case for linear algebra and serves as a reminder of the interconnectedness of the realms of mathematics and science. Moreover, this project also served as really effective practice from the perrspective of computer science; aside from web development practice this project was also a really good creative challenge.
